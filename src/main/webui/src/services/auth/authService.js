import Keycloak from 'keycloak-js';

/**
 * Authentication with Keycloak (OpenID Connect, Authorization Code + PKCE).
 *
 * The login form itself is Keycloak's: login() redirects there and Keycloak
 * sends the browser back to the app with a code, which keycloak-js exchanges
 * for the tokens. The backend accepts the access token as a bearer token.
 *
 * Fires an 'auth-changed' event when the state changes (see AuthController).
 *
 * Usage:
 *   await auth.init();
 *   auth.authenticated / auth.user / auth.token
 *   auth.login() / auth.register() / auth.logout()
 *   auth.fetch('/api/...')  // fetch with the bearer token, refreshed if needed
 */
class AuthService extends EventTarget {

    /** @type {Keycloak|null} */
    #keycloak = null;
    #initPromise = null;

    /** Application user from /api/me: {id, username, email, displayName, language, ...} */
    user = null;

    /** Set when Keycloak or the backend could not be reached. */
    error = null;

    /** True once init() finished, whether logged in or not. */
    initialized = false;

    get authenticated() {
        return !!this.#keycloak?.authenticated && !!this.user;
    }

    get token() {
        return this.#keycloak?.token ?? null;
    }

    /** Runs once, later calls return the same promise. */
    init() {
        this.#initPromise ??= this.#init();
        return this.#initPromise;
    }

    async #init() {
        try {
            const config = await this.#getJson('/api/auth/config');
            this.#keycloak = new Keycloak({url: config.url, realm: config.realm, clientId: config.clientId});
            this.#keycloak.onTokenExpired = () => this.#refreshToken();

            // check-sso: picks up an existing Keycloak session (or the code returned
            // after a login) without forcing the login screen.
            const authenticated = await this.#keycloak.init({
                onLoad: 'check-sso',
                pkceMethod: 'S256',
                // public/ files are served under Vite's base path (/quinoa/)
                silentCheckSsoRedirectUri: `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/?$/, '/')}silent-check-sso.html`,
                checkLoginIframe: false,
            });

            if (authenticated) {
                this.#logToken('Logged in');
                this.user = await this.#getJson('/api/me', this.#keycloak.token);
                this.#logUser();
            } else {
                console.info('[auth] Not logged in');
            }
        } catch (e) {
            this.error = e;
            this.user = null;
            console.error('[auth] Authentication could not be initialized', e);
        } finally {
            this.initialized = true;
            this.#emit();
        }
    }

    /** Redirects to the Keycloak login page, in the current UI language. */
    login(locale) {
        return this.#keycloak?.login({redirectUri: this.#returnUrl(), locale});
    }

    /** Redirects to the Keycloak registration page. */
    register(locale) {
        return this.#keycloak?.register({redirectUri: this.#returnUrl(), locale});
    }

    /** Ends the Keycloak session and comes back to the app's login page. */
    logout() {
        console.info('[auth] Logging out');
        return this.#keycloak?.logout({redirectUri: `${window.location.origin}/`});
    }

    /** fetch() with the access token, refreshed first if it expires within 30 s. */
    async fetch(url, options = {}) {
        await this.#keycloak?.updateToken(30);
        const headers = new Headers(options.headers);
        if (this.token) {
            headers.set('Authorization', `Bearer ${this.token}`);
        }
        return fetch(url, {...options, headers});
    }

    async #refreshToken() {
        try {
            await this.#keycloak.updateToken(30);
            this.#logToken('Token refreshed');
        } catch (e) {
            // Session ended in Keycloak (expired, logged out elsewhere...)
            console.warn('[auth] Token could not be refreshed, logging in again', e);
            this.user = null;
            this.#emit();
        }
    }

    /** Back to the page the user was on, without the Keycloak callback parameters. */
    #returnUrl() {
        const hash = window.location.hash && window.location.hash !== '#login' ? window.location.hash : '#home';
        return `${window.location.origin}/${hash}`;
    }

    async #getJson(url, token) {
        const response = await fetch(url, {
            headers: token ? {Authorization: `Bearer ${token}`} : {},
        });
        if (!response.ok) {
            throw new Error(`${url} answered ${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    #logToken(title) {
        const kc = this.#keycloak;
        console.groupCollapsed(`[auth] ${title} - access token`);
        console.log('Access token:', kc.token);
        console.log('Decoded token:', kc.tokenParsed);
        console.log('Expires at:', new Date(kc.tokenParsed.exp * 1000).toLocaleString());
        console.groupEnd();
    }

    #logUser() {
        const {id, username, email} = this.user;
        console.info('[auth] User:', {id, username, email, keycloakId: this.#keycloak.subject});
    }

    #emit() {
        this.dispatchEvent(new Event('auth-changed'));
    }
}

export const auth = new AuthService();

/**
 * Lit reactive controller: re-renders the host whenever the auth state changes.
 *   this.auth = new AuthController(this);
 */
export class AuthController {
    constructor(host) {
        this.host = host;
        this._onChange = () => host.requestUpdate();
        host.addController(this);
    }

    hostConnected() {
        auth.addEventListener('auth-changed', this._onChange);
    }

    hostDisconnected() {
        auth.removeEventListener('auth-changed', this._onChange);
    }
}
