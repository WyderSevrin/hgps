import {LitElement, html} from 'lit';
import { emptyStateStyles, switchStyles } from '../../styles/shared.styles.js';
import { userOptionsPanelStyles } from './user-options-panel.styles.js';
import {styleMap} from 'lit/directives/style-map.js';
import '../icon/icon.js';
import '../dialog/confirmDialogComponent.js';
import {I18nController, t} from '../../services/i18n/i18n.js';
import {THEMES, ThemeController, getTheme, setTheme} from '../../services/theme/theme.js';
import {MAP_STYLES, MapStyleController, getMapStyle, setMapStyle, previewTileUrl} from '../../services/mapStyle/mapStyle.js';
import {auth, AuthController} from '../../services/auth/authService.js';
import {UserService} from '../../services/api/userService.js';

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
 * Account holds the public profile switch, Map the map style picker and
 * Appearance the color theme picker. A category without options renders a placeholder.
 *
 * @property {string} category - id of the selected category
 */
export class UserOptionsPanel extends LitElement {
    static styles = [emptyStateStyles, switchStyles, userOptionsPanelStyles];

    static properties = {
        category: {type: String},
        _confirmPublicProfile: {state: true}, // true while the "make public?" dialog is open
        _savingPublicProfile: {state: true},
        _publicProfileError: {state: true},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.theme = new ThemeController(this);
        this.mapStyle = new MapStyleController(this);
        this.authState = new AuthController(this); // re-render when auth.user is loaded
        this.category = CATEGORIES[0].id;
        this._confirmPublicProfile = false;
        this._savingPublicProfile = false;
        this._publicProfileError = false;
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

    /**
     * One selectable card of a picker (a radio button styled as a card):
     * a preview, then the option's name and description.
     * @param {object}   choice
     * @param {string}   choice.group     radio group name
     * @param {object}   choice.option    the option, with an `id`
     * @param {boolean}  choice.selected
     * @param {string}   choice.i18nKey   key of the option's {name, description}
     * @param {*}        choice.preview   template shown at the top of the card
     * @param {function} choice.onSelect  called with the option's id
     */
    _renderChoice({group, option, selected, i18nKey, preview, onSelect}) {
        return html`
            <label class="choice ${selected ? 'selected' : ''}">
                <input type="radio" name="${group}" value="${option.id}"
                       .checked="${selected}"
                       @change="${() => onSelect(option.id)}">
                ${preview}
                ${selected ? html`
                    <span class="check" aria-hidden="true"><custom-icon label="check"></custom-icon></span>
                ` : ''}
                <span class="choice-name">${t(`${i18nKey}.name`)}</span>
                <span class="choice-description">${t(`${i18nKey}.description`)}</span>
            </label>`;
    }

    // Mini app drawn with the theme's own tokens
    _renderThemePreview(theme) {
        return html`
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
            </div>`;
    }

    _renderAppearance() {
        const active = getTheme().id;
        return html`
            <fieldset>
                <legend>${t('userOptions.appearance.theme')}</legend>
                <p class="hint">${t('userOptions.appearance.themeHint')}</p>
                <div class="choices">
                    ${THEMES.map(theme => this._renderChoice({
                        group: 'theme',
                        option: theme,
                        selected: theme.id === active,
                        i18nKey: `userOptions.appearance.themes.${theme.id}`,
                        preview: this._renderThemePreview(theme),
                        onSelect: setTheme,
                    }))}
                </div>
            </fieldset>
        `;
    }

    _renderMap() {
        const active = getMapStyle().id;
        return html`
            <fieldset>
                <legend>${t('userOptions.map.style')}</legend>
                <p class="hint">${t('userOptions.map.styleHint')}</p>
                <div class="choices">
                    ${MAP_STYLES.map(style => this._renderChoice({
                        group: 'map-style',
                        option: style,
                        selected: style.id === active,
                        i18nKey: `userOptions.map.styles.${style.id}`,
                        // A real tile of the style, around Bern
                        preview: html`<img class="preview" src="${previewTileUrl(style)}" alt="" loading="lazy">`,
                        onSelect: setMapStyle,
                    }))}
                </div>
            </fieldset>
        `;
    }

    // ------------------------------------------------------------- account

    get _isPublicProfile() {
        return auth.user?.publicProfile === true;
    }

    _renderAccount() {
        const isPublic = this._isPublicProfile;
        return html`
            <fieldset>
                <legend>${t('userOptions.account.visibility')}</legend>
                <p class="hint">${t('userOptions.account.visibilityHint')}</p>
                <label class="switch">
                    <span class="switch-text">
                        <span class="switch-name">${t('userOptions.account.publicProfile')}</span>
                    </span>
                    <input type="checkbox" role="switch"
                           .checked="${isPublic}"
                           ?disabled="${this._savingPublicProfile}"
                           @change="${this._onPublicProfileChange}">
                </label>
                ${this._publicProfileError
                        ? html`<p class="notice error" role="alert">
                            <custom-icon label="error"></custom-icon>
                            ${t('userOptions.account.saveError')}
                        </p>`
                        : html`<p class="notice">
                            <custom-icon label="${isPublic ? 'public' : 'group'}"></custom-icon>
                            ${t(isPublic ? 'userOptions.account.publicOn' : 'userOptions.account.publicOff')}
                        </p>`}
            </fieldset>
            <confirm-dialog
                    .open="${this._confirmPublicProfile}"
                    title="${t('userOptions.account.confirmTitle')}"
                    message="${t('userOptions.account.confirmMessage')}"
                    confirmLabel="${t('userOptions.account.confirmLabel')}"
                    confirmIcon="public"
                    @confirm="${() => this._savePublicProfile(true)}"
                    @cancel="${() => this._confirmPublicProfile = false}">
            </confirm-dialog>
        `;
    }

    // Making the profile public is confirmed first; making it private again is saved directly.
    _onPublicProfileChange(event) {
        const wantsPublic = event.target.checked;
        event.target.checked = this._isPublicProfile; // the switch only moves once the change is saved
        if (wantsPublic) {
            this._confirmPublicProfile = true;
        } else {
            this._savePublicProfile(false);
        }
    }

    async _savePublicProfile(publicProfile) {
        this._confirmPublicProfile = false;
        this._savingPublicProfile = true;
        this._publicProfileError = false;
        try {
            const user = await UserService.updateSettings({publicProfile});
            auth.user.publicProfile = user.publicProfile;
        } catch (e) {
            console.warn('[settings] "publicProfile" could not be saved', e);
            this._publicProfileError = true;
        } finally {
            this._savingPublicProfile = false;
        }
    }

    // ------------------------------------------------------------ category

    _renderCategory(category) {
        switch (category.id) {
            case 'account':
                return this._renderAccount();
            case 'appearance':
                return this._renderAppearance();
            case 'map':
                return this._renderMap();
            default:
                return this._renderEmpty(category);
        }
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
                ${this._renderCategory(current)}
            </section>
        `;
    }
}

customElements.define('user-options-panel', UserOptionsPanel);
