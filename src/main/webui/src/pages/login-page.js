import {LitElement, html, css} from 'lit';
import '../components/icon/icon.js';
import '../components/language/language-menu.js';
import {I18nController, getLanguage, t} from '../services/i18n/i18n.js';
import {auth, AuthController} from '../services/auth/authService.js';

/**
 * Shown instead of the app while nobody is logged in.
 * The credentials are entered on Keycloak's own login page: the buttons
 * here redirect there (login) or to its registration form (create account).
 */
export class LoginPage extends LitElement {
    static styles = css`
        :host {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: var(--hgps-size-4);
            box-sizing: border-box;
            background:
                    linear-gradient(160deg,
                        color-mix(in srgb, var(--hgps-bg) 92%, transparent) 0%,
                        color-mix(in srgb, var(--hgps-bg) 78%, transparent) 55%,
                        color-mix(in srgb, color-mix(in srgb, var(--hgps-bg) 80%, var(--hgps-gold-deep)) 85%, transparent) 100%),
                    url('/quinoa/river.png') center / cover no-repeat,
                    var(--hgps-bg);
        }

        language-menu {
            position: absolute;
            top: var(--hgps-size-4);
            right: var(--hgps-size-4);
        }

        .card {
            width: 100%;
            max-width: 24rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--hgps-size-5);
            padding: var(--hgps-size-10) var(--hgps-size-8);
            box-sizing: border-box;
            background-color: var(--hgps-surface);
            border: thin solid var(--hgps-border);
            border-top: 0.1875rem solid var(--hgps-gold);
            border-radius: var(--hgps-size-3);
            box-shadow: 0 1.25rem 3rem var(--hgps-shadow);
            text-align: center;
        }

        .pickaxe {
            width: 3.5rem;
            height: 3.5rem;
            padding: var(--hgps-size-3);
            box-sizing: border-box;
            border-radius: 50%;
            border: thin solid var(--hgps-gold);
            background: var(--hgps-header-bg);
            color: var(--hgps-gold);
        }

        h1 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: 0.03rem;
            color: var(--hgps-gold-bright);
        }

        p {
            margin: 0;
            color: var(--hgps-text-muted);
            font-size: 0.92rem;
            line-height: 1.5;
        }

        .actions {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-3);
        }

        button {
            all: unset;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--hgps-size-2);
            padding: var(--hgps-size-3) var(--hgps-size-4);
            border-radius: var(--hgps-size-2);
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        button:focus-visible {
            outline: none;
            box-shadow: 0 0 0 0.1875rem var(--hgps-accent-ring);
        }

        button[disabled] {
            opacity: 0.5;
            cursor: default;
        }

        .primary {
            background-color: var(--hgps-accent);
            color: var(--hgps-accent-contrast);
        }

        .primary:not([disabled]):hover {
            background-color: var(--hgps-accent-hover);
        }

        .secondary {
            border: thin solid var(--hgps-border-strong);
            color: var(--hgps-text);
        }

        .secondary:not([disabled]):hover {
            background-color: var(--hgps-surface-2);
            border-color: var(--hgps-gold);
        }

        .hint, .error {
            width: 100%;
            display: flex;
            align-items: flex-start;
            gap: var(--hgps-size-2);
            padding: var(--hgps-size-3);
            box-sizing: border-box;
            border-radius: var(--hgps-size-2);
            font-size: 0.82rem;
            text-align: left;
            line-height: 1.45;
        }

        .hint {
            background-color: var(--hgps-surface-2);
            color: var(--hgps-text-muted);
        }

        .hint code {
            color: var(--hgps-gold-bright);
            font-weight: 600;
        }

        .error {
            background-color: color-mix(in srgb, var(--hgps-danger) 14%, transparent);
            border: thin solid color-mix(in srgb, var(--hgps-danger) 45%, transparent);
            color: var(--hgps-text);
        }

        .error custom-icon {
            color: var(--hgps-danger-text);
        }

        @media (max-width: 30rem) {
            .card {
                padding: var(--hgps-size-8) var(--hgps-size-5);
            }
        }
    `;

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
