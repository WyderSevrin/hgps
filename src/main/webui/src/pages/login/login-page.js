import {LitElement, html} from 'lit';
import { loginPageStyles } from './login-page.styles.js';
import '../../components/icon/icon.js';
import '../../components/language/language-menu.js';
import {I18nController, getLanguage, t} from '../../services/i18n/i18n.js';
import {auth, AuthController} from '../../services/auth/authService.js';

/**
 * Shown instead of the app while nobody is logged in.
 * The credentials are entered on Keycloak's own login page: the buttons
 * here redirect there (login) or to its registration form (create account).
 */
export class LoginPage extends LitElement {
    static styles = loginPageStyles;

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.authState = new AuthController(this);
    }

    render() {
        const unavailable = !!auth.error;
        return html`
            <language-menu></language-menu>

            <section class="card">
                <svg class="pickaxe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                     stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M4 8.5c4-3.5 12-3.5 16 0"/>
                    <path d="M4 8.5 8 12"/>
                    <path d="M20 8.5 16 12"/>
                    <path d="M12 6 12 20"/>
                </svg>

                <h1>${t('header.title')}</h1>
                <p>${t('auth.subtitle')}</p>

                ${unavailable ? html`
                    <div class="error" role="alert">
                        <custom-icon label="error_outline"></custom-icon>
                        <span>${t('auth.unavailable')}</span>
                    </div>` : ''}

                <div class="actions">
                    <button class="primary" ?disabled="${unavailable}" @click="${() => auth.login(getLanguage())}">
                        <custom-icon label="login"></custom-icon>
                        ${t('auth.login')}
                    </button>
                    <button class="secondary" ?disabled="${unavailable}" @click="${() => auth.register(getLanguage())}">
                        <custom-icon label="person_add"></custom-icon>
                        ${t('auth.register')}
                    </button>
                </div>

                ${import.meta.env.DEV ? html`
                    <div class="hint">
                        <custom-icon label="info"></custom-icon>
                        <span>${t('auth.demoHint')} <code>demo</code> / <code>demo</code></span>
                    </div>` : ''}
            </section>
        `;
    }
}

customElements.define('login-page', LoginPage);
