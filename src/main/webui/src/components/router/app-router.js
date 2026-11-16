import {LitElement, html} from 'lit';
import { appRouterStyles } from './app-router.styles.js';
import {auth, AuthController} from '../../services/auth/authService.js';

export class AppRouter extends LitElement {
    static styles = appRouterStyles;

    static properties = {
        currentPage: {type: String},
    };

    constructor() {
        super();
        this.currentPage = this._getPageFromHash();
        this._onHashChange = this._onHashChange.bind(this);
        // Re-render on login / logout; nothing is shown until Keycloak answered
        this.authState = new AuthController(this);
        // After a login the hash still holds Keycloak's callback (#state=...&code=...)
        // until keycloak-js cleans it with replaceState, which fires no hashchange.
        auth.init().then(() => this.currentPage = this._getPageFromHash());
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('hashchange', this._onHashChange);
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this._onHashChange);
        super.disconnectedCallback();
    }

    _onHashChange() {
        this.currentPage = this._getPageFromHash();
    }

    _getPageFromHash() {
        const hash = window.location.hash;
        return hash ? hash.replace('#', '') : 'home';
    }

    _renderPage() {
        switch (this.currentPage) {
            case 'home':
                return html`
                    <home-page></home-page>`;
            case 'map':
                return html`
                    <map-page></map-page>`;
            case 'guide':
                return html`
                    <guide-page></guide-page>`;
            default:
                return html`
                    <not-found-page></not-found-page>`;
        }
    }

    render() {
        if (!auth.initialized) {
            return html``;
        }
        if (!auth.authenticated) {
            return html`<login-page></login-page>`;
        }
        return html`
            <header-component></header-component>
            <main>
                <side-bar-component></side-bar-component>
                <div class="pageContainer">
                    ${this._renderPage()}
                </div>
            </main>
        `;
    }


}

customElements.define('app-router', AppRouter);