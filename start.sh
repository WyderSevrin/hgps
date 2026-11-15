#!/usr/bin/env bash
# Starts HGPS in dev mode:
#   1. Docker (Docker Desktop / the Docker service), if it is not running yet
#   2. PostgreSQL + Keycloak (docker-compose.yml), waiting until they are healthy
#   3. Quarkus dev mode, which also starts the Vite frontend (Quinoa)
#
# Usage:
#   ./start.sh          start everything
#   ./start.sh --stop   stop the Docker services (data is kept in the volume)
#   ./start.sh -Dx=y    other arguments are passed to quarkus:dev
#
# App:      http://localhost:8080        (demo / demo)
# Keycloak: http://localhost:8180/admin  (admin / admin)

set -euo pipefail

cd "$(dirname "$0")"

# How long to wait for Docker to be ready after starting it, in seconds
DOCKER_TIMEOUT=180

docker_running() {
    docker info >/dev/null 2>&1
}

# Starts Docker in the background, depending on the platform.
start_docker() {
    # Recent Docker Desktop versions (4.37+) can be started from the CLI
    if docker desktop start --detach >/dev/null 2>&1; then
        return 0
    fi

    case "$(uname -s)" in
        MINGW* | MSYS* | CYGWIN*)
            # Git Bash on Windows: detached, so it outlives this terminal
            cmd.exe //c start "" "%ProgramFiles%\\Docker\\Docker\\Docker Desktop.exe"
            ;;
        Darwin)
            open -a Docker
            ;;
        Linux)
            if grep -qi microsoft /proc/version 2>/dev/null; then
                # WSL: Docker Desktop runs on the Windows side
                "/mnt/c/Program Files/Docker/Docker/Docker Desktop.exe" >/dev/null 2>&1 &
            elif systemctl --user list-unit-files docker-desktop.service >/dev/null 2>&1; then
                systemctl --user start docker-desktop
            else
                sudo systemctl start docker
            fi
            ;;
        *)
            echo "Don't know how to start Docker on $(uname -s). Start it manually and try again." >&2
            exit 1
            ;;
    esac
}

if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is not installed or not on the PATH." >&2
    exit 1
fi

if [[ "${1:-}" == "--stop" ]]; then
    if ! docker_running; then
        echo "Docker is not running, nothing to stop."
        exit 0
    fi
    echo "==> Stopping PostgreSQL and Keycloak"
    docker compose stop
    exit 0
fi

if ! docker_running; then
    echo "==> Starting Docker"
    start_docker
    printf "    Waiting for Docker to be ready"
    for ((waited = 0; waited < DOCKER_TIMEOUT; waited += 2)); do
        if docker_running; then
            break
        fi
        printf "."
        sleep 2
    done
    echo
    if ! docker_running; then
        echo "Docker did not start within ${DOCKER_TIMEOUT} s. Check Docker Desktop and try again." >&2
        exit 1
    fi
fi

echo "==> Starting PostgreSQL and Keycloak (waiting until healthy)"
docker compose up -d --wait

echo "==> Starting Quarkus dev mode (backend + frontend)"
echo "    App:      http://localhost:8080  (demo / demo)"
echo "    Keycloak: http://localhost:8180/admin  (admin / admin)"
echo "    Dev UI:   http://localhost:8080/q/dev/"
echo
exec ./mvnw quarkus:dev "$@"
