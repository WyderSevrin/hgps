import { LitElement, html, css } from 'lit';
import { live } from 'lit/directives/live.js';
import { I18nController, SUPPORTED_LANGUAGES, getLanguage, setLanguage, t } from '../../services/i18n/i18n.js';

export class HeaderComponent extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        header {
            position: relative;
            display: flex;
            align-items: center;
            gap: 12px;
            box-sizing: border-box;
            padding: 6px 24px;
            /* Match the 60px slot reserved by the app layout (main margin-top) */
            height: 60px;
            background: var(--hgps-header-bg);
            color: var(--hgps-on-header);
            border-bottom: 2px solid var(--hgps-header-border);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .pickaxe {
            width: 30px;
            height: 30px;
            flex: 0 0 auto;
            color: var(--hgps-gold);
        }

        .title {
            margin: 0;
            font-size: clamp(18px, 3vw, 24px);
            font-weight: 800;
            letter-spacing: 0.5px;
            color: var(--hgps-gold-bright);
        }

        /* Language selector pinned to the far right */
        .lang {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .lang select {
            appearance: none;
            -webkit-appearance: none;
            background: var(--hgps-header-control);
            color: var(--hgps-on-header);
            border: 1px solid var(--hgps-gold);
            border-radius: 6px;
            padding: 5px 28px 5px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.25s ease, border-color 0.25s ease;
            /* Custom golden chevron */
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 14px;
        }
        .lang select:hover {
            background-color: var(--hgps-header-control-hover);
            border-color: var(--hgps-gold-bright);
        }
        .lang select:focus {
            outline: none;
            border-color: var(--hgps-gold-bright);
            box-shadow: 0 0 0 2px var(--hgps-accent-ring);
        }
        .lang option {
            background: var(--hgps-slate);
            color: var(--hgps-on-header);
        }

        @media (max-width: 520px) {
            header { padding: 6px 12px; }
            .brand { gap: 8px; }
        }
    `;

    static properties = {
        language: { type: String },
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.language = getLanguage();
    }

    onLanguageChange(event) {
        this.language = event.target.value;
        setLanguage(this.language);
    }

    render() {
        return html`
            <header>
                <!-- Brand: simple pickaxe icon + title -->
                <div class="brand">
                    <svg
                        class="pickaxe"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <!-- Double-pointed pick head, sweeping down to both tips -->
                        <path d="M4 8.5c4-3.5 12-3.5 16 0" />
                        <path d="M4 8.5 8 12" />
                        <path d="M20 8.5 16 12" />
                        <!-- Wooden handle down through the head -->
                        <path d="M12 6 12 20" />
                    </svg>

                    <h1 class="title">${t('header.title')}</h1>
                </div>

                <!-- Far-right language selector -->
                <div class="lang">
                    <select
                        aria-label="${t('header.selectLanguage')}"
                        .value="${live(this.language)}"
                        @change="${this.onLanguageChange}"
                    >
                        ${SUPPORTED_LANGUAGES.map(lang => html`
                            <option value="${lang.code}" ?selected="${lang.code === this.language}">${lang.label}</option>`)}
                    </select>
                </div>
            </header>
        `;
    }
}

customElements.define('header-component', HeaderComponent);
