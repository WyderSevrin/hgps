@echo off
rem Starts HGPS in dev mode (Windows):
rem   1. Docker Desktop, if it is not running yet
rem   2. PostgreSQL + Keycloak (docker-compose.yml), waiting until they are healthy
rem   3. Quarkus dev mode, which also starts the Vite frontend (Quinoa)
rem
rem Usage:
rem   start.cmd          start everything (or double-click it)
rem   start.cmd --stop   stop the Docker services (data is kept in the volume)
rem   start.cmd -Dx=y    other arguments are passed to quarkus:dev
rem
rem App:      http://localhost:8080        (demo / demo)
rem Keycloak: http://localhost:8180/admin  (admin / admin)

setlocal
cd /d "%~dp0"

rem How long to wait for Docker to be ready after starting it, in seconds
set DOCKER_TIMEOUT=180
set "DOCKER_DESKTOP=%ProgramFiles%\Docker\Docker\Docker Desktop.exe"

where docker >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed or not on the PATH.
    goto :fail
)

if /i "%~1"=="--stop" goto :stop

docker info >nul 2>&1
if not errorlevel 1 goto :compose

echo ==^> Starting Docker Desktop
rem Recent Docker Desktop versions [4.37+] can be started from the CLI
docker desktop start --detach >nul 2>&1
if not errorlevel 1 goto :wait_docker
if not exist "%DOCKER_DESKTOP%" (
    echo Docker Desktop was not found at "%DOCKER_DESKTOP%". Start Docker manually and try again.
    goto :fail
)
start "" "%DOCKER_DESKTOP%"

:wait_docker
<nul set /p "=    Waiting for Docker to be ready"
set /a WAITED=0
:wait_docker_loop
docker info >nul 2>&1
if not errorlevel 1 goto :docker_ready
if %WAITED% geq %DOCKER_TIMEOUT% (
    echo.
    echo Docker did not start within %DOCKER_TIMEOUT% s. Check Docker Desktop and try again.
    goto :fail
)
<nul set /p "=."
rem Waits 2 s [ping works even when stdin is not a console, unlike timeout]
ping -n 3 127.0.0.1 >nul
set /a WAITED+=2
goto :wait_docker_loop

:docker_ready
echo.

:compose
echo ==^> Starting PostgreSQL and Keycloak (waiting until healthy)
docker compose up -d --wait
if errorlevel 1 (
    echo The Docker services could not be started.
    goto :fail
)

echo ==^> Starting Quarkus dev mode (backend + frontend)
echo     App:      http://localhost:8080  (demo / demo)
echo     Keycloak: http://localhost:8180/admin  (admin / admin)
echo     Dev UI:   http://localhost:8080/q/dev/
echo.
rem Full path, so it also works when the current folder is not searched for programs
call "%~dp0mvnw.cmd" quarkus:dev %*
goto :end

:stop
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running, nothing to stop.
    goto :end
)
echo ==^> Stopping PostgreSQL and Keycloak
docker compose stop
goto :end

:fail
rem Keep the window open when started by double-click
pause
endlocal
exit /b 1

:end
endlocal
