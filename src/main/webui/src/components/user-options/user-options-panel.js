import {LitElement, html} from 'lit';
import { emptyStateStyles } from '../../styles/shared.styles.js';
import { userOptionsPanelStyles } from './user-options-panel.styles.js';
import {styleMap} from 'lit/directives/style-map.js';
import '../icon/icon.js';
import {I18nController, t} from '../../services/i18n/i18n.js';
import {THEMES, ThemeController, getTheme, setTheme} from '../../services/theme/theme.js';

// Option categories, in navigation order. Labels come from
// userOptions.categories.<id>.{title,description}.
const CATEGORIES = [
    {id: 'account', icon: 'account_circle'},
    {id: 'map', icon: 'map'},
    {id: 'appearance', icon: 'palette'},
];

/**
 * User options, split into categories: a side navigation on the left and
 * the selected category's options on the right. On narrow screens the
 * navigation becomes a row of tabs above the content.
 *
 * Appearance holds the color theme picker; the other categories are still
 * empty and render a placeholder.
 *
 * @property {string} category - id of the selected category
 */
export class UserOptionsPanel extends LitElement {
    static styles = [emptyStateStyles, userOptionsPanelStyles];

    static properties = {
        category: {type: String},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.theme = new ThemeController(this);
        this.category = CATEGORIES[0].id;
    }

    get _tabs() {
        return [...this.shadowRoot.querySelectorAll('.tab')];
    }

    // Arrow keys move between categories (both orientations), Home/End jump.
    _onNavKeyDown(event) {
        const index = CATEGORIES.findIndex(c => c.id === this.category);
        const last = CATEGORIES.length - 1;
        const next = {
            ArrowDown: index === last ? 0 : index + 1,
            ArrowRight: index === last ? 0 : index + 1,
            ArrowUp: index === 0 ? last : index - 1,
            ArrowLeft: index === 0 ? last : index - 1,
            Home: 0,
            End: last,
        }[event.key];
        if (next === undefined) return;
        event.preventDefault();
        this.category = CATEGORIES[next].id;
        this.updateComplete.then(() => this._tabs[next]?.focus());
    }

    _renderAppearance() {
        const active = getTheme().id;
        return html`
            <fieldset>
                <legend>${t('userOptions.appearance.theme')}</legend>
                <p class="hint">${t('userOptions.appearance.themeHint')}</p>
                <div class="themes">
                    ${THEMES.map(theme => {
                        const selected = theme.id === active;
                        const key = `userOptions.appearance.themes.${theme.id}`;
                        return html`
                            <label class="theme ${selected ? 'selected' : ''}">
                                <input type="radio" name="theme" value="${theme.id}"
                                       .checked="${selected}"
                                       @change="${() => setTheme(theme.id)}">
                                <div class="preview" aria-hidden="true"
                                     style="${styleMap({...theme.tokens, colorScheme: theme.colorScheme})}">
                                    <div class="p-header"></div>
                                    <div class="p-body">
                                        <div class="p-side"></div>
                                        <div class="p-card">
                                            <div class="p-line"></div>
                                            <div class="p-line muted"></div>
                                            <div class="p-button"></div>
                                        </div>
                                    </div>
                                </div>
                                ${selected ? html`
                                    <span class="check" aria-hidden="true"><custom-icon label="check"></custom-icon></span>
                                ` : ''}
                                <span class="theme-name">${t(`${key}.name`)}</span>
                                <span class="theme-description">${t(`${key}.description`)}</span>
                            </label>`;
                    })}
                </div>
            </fieldset>
        `;
    }

    _renderEmpty(category) {
        return html`
            <div class="empty">
                <custom-icon label="${category.icon}"></custom-icon>
                <span>${t('userOptions.empty')}</span>
            </div>
        `;
    }

    render() {
        const current = CATEGORIES.find(c => c.id === this.category) ?? CATEGORIES[0];
        const key = `userOptions.categories.${current.id}`;
        return html`
            <nav role="tablist" aria-orientation="vertical"
                 aria-label="${t('userOptions.categoriesLabel')}"
                 @keydown="${this._onNavKeyDown}">
                ${CATEGORIES.map(c => {
                    const selected = c.id === current.id;
                    return html`
                        <button class="tab" role="tab" id="tab-${c.id}"
                                aria-selected="${selected}"
                                aria-controls="panel"
                                tabindex="${selected ? 0 : -1}"
                                @click="${() => this.category = c.id}">
                            <custom-icon label="${c.icon}"></custom-icon>
                            <span>${t(`userOptions.categories.${c.id}.title`)}</span>
                        </button>`;
                })}
            </nav>

            <section class="content" id="panel" role="tabpanel" aria-labelledby="tab-${current.id}">
                <div class="content-header">
                    <h3>${t(`${key}.title`)}</h3>
                    <p>${t(`${key}.description`)}</p>
                </div>
                ${current.id === 'appearance' ? this._renderAppearance() : this._renderEmpty(current)}
            </section>
        `;
    }
}

customElements.define('user-options-panel', UserOptionsPanel);
