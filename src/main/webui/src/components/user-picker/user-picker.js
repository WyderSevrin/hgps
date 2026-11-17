import {LitElement, html} from 'lit';
import { userPickerStyles } from './user-picker.styles.js';
import '../icon/icon.js';
import {I18nController, t} from '../../services/i18n/i18n.js';
import {UserService} from '../../services/api/userService.js';

const SEARCH_DELAY_MS = 250; // wait for a pause in typing before searching
const SEARCH_LIMIT = 8;

/**
 * Search users by name and select several of them, e.g. to show their areas on the map.
 * Only finds the users whose public areas the logged-in user may see: their friends and
 * the users with a public profile (GET /api/users/search?areasVisible=true).
 *
 * The selected users are shown as chips; clicking a result adds or removes it.
 *
 * Fires `selection-change` with `detail: {users}` (array of {id, username, displayName})
 * every time a user is added or removed.
 */
export class UserPicker extends LitElement {
    static styles = userPickerStyles;

    static properties = {
        _query: {state: true},
        _results: {state: true},   // null = no search done for the current text
        _searching: {state: true},
        _searchError: {state: true},
        _selected: {state: true},  // the selected users, in the order they were added
    };

    #searchTimer = null;
    #searchSeq = 0; // to ignore answers of searches that are no longer current

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this._query = '';
        this._results = null;
        this._searching = false;
        this._searchError = false;
        this._selected = [];
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        clearTimeout(this.#searchTimer);
    }

    /** The text actually searched: trimmed, without a leading "@". */
    get _term() {
        return this._query.trim().replace(/^@/, '');
    }

    _isSelected(user) {
        return this._selected.some(selected => selected.id === user.id);
    }

    // -------------------------------------------------------------- search

    _onInput(event) {
        this._query = event.target.value;
        this._searchError = false;
        clearTimeout(this.#searchTimer);

        if (this._term.length < UserService.MIN_SEARCH_LENGTH) {
            this.#searchSeq++; // drop an answer still on its way
            this._results = null;
            this._searching = false;
            return;
        }
        this._searching = true;
        this.#searchTimer = setTimeout(() => this._search(this._term), SEARCH_DELAY_MS);
    }

    _onKeyDown(event) {
        if (event.key === 'Escape' && this._query) {
            event.stopPropagation();
            this._clearSearch();
        }
    }

    async _search(term) {
        const seq = ++this.#searchSeq;
        try {
            const results = await UserService.search(term, SEARCH_LIMIT, {areasVisible: true});
            if (seq !== this.#searchSeq) return;
            this._results = results;
        } catch (e) {
            if (seq !== this.#searchSeq) return;
            console.warn('[user-picker] Search failed', e);
            this._searchError = true;
            this._results = null;
        } finally {
            if (seq === this.#searchSeq) this._searching = false;
        }
    }

    _clearSearch() {
        clearTimeout(this.#searchTimer);
        this.#searchSeq++;
        this._query = '';
        this._results = null;
        this._searching = false;
        this._searchError = false;
    }

    // ----------------------------------------------------------- selection

    _toggle(user) {
        this._setSelected(this._isSelected(user)
            ? this._selected.filter(selected => selected.id !== user.id)
            : [...this._selected, user]);
    }

    _remove(user) {
        this._setSelected(this._selected.filter(selected => selected.id !== user.id));
    }

    _setSelected(users) {
        this._selected = users;
        this.dispatchEvent(new CustomEvent('selection-change', {
            detail: {users},
            bubbles: true,
            composed: true,
        }));
    }

    // -------------------------------------------------------------- render

    render() {
        return html`
            <div class="search">
                <custom-icon label="person_search"></custom-icon>
                <input type="search"
                       placeholder="${t('mapFilters.userSearch.placeholder')}"
                       aria-label="${t('mapFilters.userSearch.placeholder')}"
                       .value="${this._query}"
                       @input="${this._onInput}"
                       @keydown="${this._onKeyDown}">
                ${this._searching ? html`<span class="spinner" aria-hidden="true"></span>` : null}
            </div>
            ${this._renderResults()}
            ${this._renderSelected()}
        `;
    }

    _renderResults() {
        if (this._searchError) {
            return html`<p class="hint error" role="alert">${t('mapFilters.userSearch.error')}</p>`;
        }
        if (this._query.trim() && this._term.length < UserService.MIN_SEARCH_LENGTH) {
            return html`<p class="hint">${t('mapFilters.userSearch.hint', {count: UserService.MIN_SEARCH_LENGTH})}</p>`;
        }
        if (this._results === null) {
            return html`<p class="hint">${t('mapFilters.userSearch.info')}</p>`;
        }
        if (this._results.length === 0) {
            return html`<p class="hint">${t('mapFilters.userSearch.noResults', {term: this._term})}</p>`;
        }
        return html`
            <ul class="results">
                ${this._results.map(user => {
                    const selected = this._isSelected(user);
                    return html`
                        <li>
                            <button class="result ${selected ? 'selected' : ''}"
                                    aria-pressed="${selected}"
                                    @click="${() => this._toggle(user)}">
                                <span class="names">
                                    <span class="display-name">${user.displayName}</span>
                                    <span class="username">@${user.username}</span>
                                </span>
                                <custom-icon label="${selected ? 'check_circle' : 'add_circle_outline'}"></custom-icon>
                            </button>
                        </li>`;
                })}
            </ul>`;
    }

    _renderSelected() {
        if (this._selected.length === 0) return null;
        return html`
            <div class="selected-users">
                <span class="selected-label">${t('mapFilters.userSearch.selected')}</span>
                <ul class="chips">
                    ${this._selected.map(user => html`
                        <li class="chip">
                            <span>${user.displayName}</span>
                            <button class="chip-remove"
                                    title="${t('mapFilters.userSearch.remove', {name: user.displayName})}"
                                    aria-label="${t('mapFilters.userSearch.remove', {name: user.displayName})}"
                                    @click="${() => this._remove(user)}">
                                <custom-icon label="close"></custom-icon>
                            </button>
                        </li>`)}
                </ul>
            </div>`;
    }
}

customElements.define('user-picker', UserPicker);
