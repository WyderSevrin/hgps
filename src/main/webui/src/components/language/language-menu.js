import {LitElement, html} from 'lit';
import { headerControlStyles, popoverStyles } from '../../styles/shared.styles.js';
import { languageMenuStyles } from './language-menu.styles.js';
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
    static styles = [headerControlStyles, popoverStyles, languageMenuStyles];

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
            <button class="trigger header-control"
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

            <div class="menu popover" id="menu" role="menu"
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
