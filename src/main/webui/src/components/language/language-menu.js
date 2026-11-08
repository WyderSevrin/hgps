import {LitElement, html, css} from 'lit';
import '../icon/icon.js';
import {FLAGS} from './flags.js';
import {I18nController, SUPPORTED_LANGUAGES, getLanguage, setLanguage, t} from '../../services/i18n/i18n.js';

/**
 * Round header button showing the current language's flag. Clicking it opens
 * a small menu anchored under the button to pick another language.
 * Closes on selection, a second click, Escape, or a click anywhere outside.
 * Arrow keys / Home / End move between languages inside the menu.
 */
export class LanguageMenu extends LitElement {
    static styles = css`
        :host {
            position: relative;
            display: inline-flex;
        }

        .flag {
            display: block;
            overflow: hidden;
            border-radius: 50%;
        }

        .flag svg {
            display: block;
            width: 100%;
            height: 100%;
        }

        .trigger {
            all: unset;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            box-sizing: border-box;
            border-radius: 50%;
            background: var(--hgps-header-control);
            border: 1px solid var(--hgps-gold);
            cursor: pointer;
            transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .trigger .flag {
            width: 26px;
            height: 26px;
            transition: transform 0.2s ease;
        }

        .trigger:hover,
        :host([open]) .trigger {
            border-color: var(--hgps-gold-bright);
        }

        .trigger:hover .flag {
            transform: scale(1.06);
        }

        .trigger:focus-visible {
            outline: none;
            border-color: var(--hgps-gold-bright);
            box-shadow: 0 0 0 2px var(--hgps-accent-ring);
        }

        /* Small chevron pill, so the button reads as a picker */
        .chevron {
            position: absolute;
            right: -3px;
            bottom: -3px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: var(--hgps-gold);
            color: var(--hgps-accent-contrast);
            border: 2px solid var(--hgps-slate-deep);
            font-size: 10px;
            transition: transform 0.2s ease;
        }

        .chevron svg {
            width: 10px;
            height: 10px;
        }

        :host([open]) .chevron {
            transform: rotate(180deg);
        }

        /* ---- Menu bubble ---- */
        .menu {
            position: absolute;
            top: calc(100% + 12px);
            right: -8px;
            min-width: 11rem;
            margin: 0;
            padding: var(--hgps-size-1);
            list-style: none;
            box-sizing: border-box;
            background-color: var(--hgps-surface);
            border: thin solid var(--hgps-border);
            border-radius: var(--hgps-size-3);
            box-shadow: 0 0.625rem 1.875rem var(--hgps-shadow);
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            transform-origin: top right;
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
            visibility: hidden;
            transition: opacity 0.15s ease, transform 0.15s ease, visibility 0s linear 0.15s;
        }

        :host([open]) .menu {
            opacity: 1;
            transform: none;
            visibility: visible;
            transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .menu::before {
            content: '';
            position: absolute;
            top: -7px;
            right: 19px;
            width: 12px;
            height: 12px;
            background-color: var(--hgps-surface);
            border-top: thin solid var(--hgps-border);
            border-left: thin solid var(--hgps-border);
            transform: rotate(45deg);
        }

        .option {
            all: unset;
            position: relative; /* above the arrow */
            box-sizing: border-box;
            width: 100%;
            display: flex;
            align-items: center;
            gap: var(--hgps-size-3);
            padding: var(--hgps-size-2) var(--hgps-size-3);
            border-radius: var(--hgps-size-2);
            color: var(--hgps-text);
            font-size: 0.88rem;
            cursor: pointer;
            transition: background-color 0.15s ease;
        }

        .option:hover,
        .option:focus-visible {
            background-color: var(--hgps-surface-2);
        }

        .option:focus-visible {
            outline: 0.125rem solid var(--hgps-accent);
            outline-offset: -0.125rem;
        }

        .option .flag {
            flex: 0 0 auto;
            width: 22px;
            height: 22px;
            box-shadow: 0 0 0 1px var(--hgps-border-strong);
        }

        .option .name {
            flex: 1;
        }

        .option .code {
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--hgps-text-subtle);
        }

        .option[aria-checked="true"] {
            color: var(--hgps-text-strong);
            font-weight: 600;
        }

        .option[aria-checked="true"] .code {
            color: var(--hgps-accent);
        }

        .check {
            width: 1.25rem;
            color: var(--hgps-accent);
        }

        @media (prefers-reduced-motion: reduce) {
            .menu, :host([open]) .menu, .chevron, .trigger .flag { transition: none; }
        }
    `;

    static properties = {
        open: {type: Boolean, reflect: true},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.open = false;
        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this._onDocumentClick);
        window.addEventListener('keydown', this._onKeyDown);
    }

    disconnectedCallback() {
        document.removeEventListener('click', this._onDocumentClick);
        window.removeEventListener('keydown', this._onKeyDown);
        super.disconnectedCallback();
    }

    get _options() {
        return [...this.shadowRoot.querySelectorAll('.option')];
    }

    _onDocumentClick(event) {
        if (this.open && !event.composedPath().includes(this)) this.open = false;
    }

    _onKeyDown(event) {
        if (this.open && event.key === 'Escape') this._close();
    }

    _close() {
        this.open = false;
        this.shadowRoot.querySelector('.trigger')?.focus();
    }

    async _toggle() {
        this.open = !this.open;
        if (!this.open) return;
        // Focus the current language once the menu is visible.
        await this.updateComplete;
        (this._options.find(o => o.getAttribute('aria-checked') === 'true') ?? this._options[0])?.focus();
    }

    _onMenuKeyDown(event) {
        const options = this._options;
        const index = options.indexOf(this.shadowRoot.activeElement);
        const next = {
            ArrowDown: (index + 1) % options.length,
            ArrowUp: (index - 1 + options.length) % options.length,
            Home: 0,
            End: options.length - 1,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        options[next].focus();
    }

    _select(code) {
        if (code !== getLanguage()) setLanguage(code);
        this._close();
    }

    render() {
        const current = SUPPORTED_LANGUAGES.find(l => l.code === getLanguage()) ?? SUPPORTED_LANGUAGES[0];
        const label = `${t('header.selectLanguage')} (${current.name})`;
        return html`
            <button class="trigger"
                    title="${label}"
                    aria-label="${label}"
                    aria-haspopup="menu"
                    aria-expanded="${this.open}"
                    aria-controls="menu"
                    @click="${this._toggle}">
                <span class="flag">${FLAGS[current.code]}</span>
                <span class="chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"
                         stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                </span>
            </button>

            <div class="menu" id="menu" role="menu"
                 aria-label="${t('header.selectLanguage')}"
                 ?inert="${!this.open}"
                 @keydown="${this._onMenuKeyDown}">
                ${SUPPORTED_LANGUAGES.map(lang => {
                    const selected = lang.code === current.code;
                    return html`
                        <button class="option" role="menuitemradio" lang="${lang.code}"
                                aria-checked="${selected}"
                                @click="${() => this._select(lang.code)}">
                            <span class="flag">${FLAGS[lang.code]}</span>
                            <span class="name">${lang.name}</span>
                            <span class="code">${lang.label}</span>
                            <span class="check">${selected ? html`<custom-icon label="check"></custom-icon>` : null}</span>
                        </button>`;
                })}
            </div>
        `;
    }
}

customElements.define('language-menu', LanguageMenu);
