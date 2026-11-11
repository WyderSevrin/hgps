import {LitElement, html, css} from 'lit';
import '../icon/icon.js';
import {I18nController, t, getLanguage} from '../../services/i18n/i18n.js';
import {auth} from '../../services/auth/authService.js';
import {UserService} from '../../services/api/userService.js';
import {InvitationService} from '../../services/api/invitationService.js';

// Avatar tints, picked deterministically from the person's id.
const AVATAR_TOKENS = [
    '--hgps-gold-level-1', '--hgps-gold-level-2', '--hgps-gold-level-3',
    '--hgps-gold-level-4', '--hgps-gold-level-5',
];

const MIN_SEARCH_LENGTH = 2; // same as the backend (GET /api/users/search)
const SEARCH_DELAY_MS = 250; // wait for a pause in typing before searching
const SEARCH_LIMIT = 8;

// Relation of the logged-in user to another user, from the invitations
const RELATION = Object.freeze({FRIEND: 'friend', OUTGOING: 'outgoing', INCOMING: 'incoming'});

const {PENDING, ACCEPTED} = InvitationService.STATUS;

/**
 * Friends panel, all from the logged-in user's invitations (GET /api/invitations):
 *  - search a user by name or username, select them and send a friend request,
 *  - the requests the user sent that are still pending (can be cancelled: deleted),
 *  - the incoming requests (accept / decline),
 *  - the friends (= accepted invitations; can be removed: deleted).
 */
export class FriendsPanel extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-4);
        }

        /* ---- Find a user ---- */
        .finder {
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-2);
        }

        .search {
            display: flex;
            align-items: center;
            gap: var(--hgps-size-2);
            padding: 0 var(--hgps-size-3);
            background-color: var(--hgps-bg);
            border: thin solid var(--hgps-border);
            border-radius: var(--hgps-size-2);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .search:focus-within {
            border-color: var(--hgps-accent);
            box-shadow: 0 0 0 0.1875rem var(--hgps-accent-ring);
        }

        .search custom-icon {
            color: var(--hgps-text-subtle);
        }

        .search input {
            flex: 1;
            min-width: 0;
            height: 2.75rem;
            border: none;
            outline: none;
            background: transparent;
            color: var(--hgps-text);
            font: inherit;
            font-size: 0.95rem;
        }

        .search input::placeholder {
            color: var(--hgps-text-faint);
        }

        .spinner {
            flex: 0 0 auto;
            width: 1rem;
            height: 1rem;
            border: 0.125rem solid var(--hgps-border-strong);
            border-top-color: var(--hgps-accent);
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }

        .hint {
            display: flex;
            align-items: center;
            gap: var(--hgps-size-2);
            margin: 0;
            padding: 0 var(--hgps-size-1);
            font-size: 0.82rem;
            color: var(--hgps-text-subtle);
        }

        .hint.error {
            color: var(--hgps-danger-text);
        }

        /* Search results: each row is a button that selects the user */
        .results li {
            padding: 0;
            background: none;
            border: none;
        }

        .result {
            all: unset;
            box-sizing: border-box;
            width: 100%;
            display: flex;
            align-items: center;
            gap: var(--hgps-size-3);
            padding: var(--hgps-size-2) var(--hgps-size-3);
            background-color: var(--hgps-surface-2);
            border: thin solid transparent;
            border-radius: var(--hgps-size-3);
            cursor: pointer;
            transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease;
        }

        .result:hover {
            border-color: var(--hgps-accent);
            background-color: color-mix(in srgb, var(--hgps-accent) 6%, var(--hgps-surface-2));
        }

        .result:active {
            transform: scale(0.99);
        }

        .result:focus-visible {
            outline: 0.125rem solid var(--hgps-accent);
            outline-offset: 0.125rem;
        }

        .result .chevron {
            color: var(--hgps-text-faint);
        }

        mark {
            background: none;
            color: var(--hgps-accent);
            font-weight: 700;
        }

        .badge {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            padding: 0.125rem var(--hgps-size-2);
            border-radius: var(--hgps-size-10);
            font-size: 0.7rem;
            font-weight: 700;
            white-space: nowrap;
            background-color: var(--hgps-surface-3);
            color: var(--hgps-text-muted);
        }

        .badge.friend {
            background-color: color-mix(in srgb, var(--hgps-accent) 22%, transparent);
            color: var(--hgps-accent);
        }

        .badge.incoming {
            background-color: var(--hgps-accent);
            color: var(--hgps-accent-contrast);
        }

        /* Selected user, with the "send request" action */
        .selected {
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-3);
            padding: var(--hgps-size-4);
            background-color: color-mix(in srgb, var(--hgps-accent) 7%, var(--hgps-surface-2));
            border: thin solid color-mix(in srgb, var(--hgps-accent) 45%, transparent);
            border-radius: var(--hgps-size-3);
            animation: pop-in 0.18s ease-out;
        }

        .selected-head {
            display: flex;
            align-items: center;
            gap: var(--hgps-size-3);
        }

        .selected .avatar {
            width: 3.25rem;
            height: 3.25rem;
            font-size: 1.05rem;
        }

        .selected .name {
            font-size: 1.05rem;
        }

        .send-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--hgps-size-2);
            height: 2.75rem;
            border: none;
            border-radius: var(--hgps-size-2);
            background-color: var(--hgps-accent);
            color: var(--hgps-accent-contrast);
            font: inherit;
            font-size: 0.92rem;
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.15s ease, opacity 0.15s ease;
        }

        .send-btn:hover:not(:disabled) {
            background-color: var(--hgps-accent-hover);
        }

        .send-btn:disabled {
            opacity: 0.6;
            cursor: progress;
        }

        .send-btn .spinner {
            border-color: color-mix(in srgb, var(--hgps-accent-contrast) 30%, transparent);
            border-top-color: var(--hgps-accent-contrast);
        }

        .status {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--hgps-size-2);
            min-height: 2.75rem;
            padding: 0 var(--hgps-size-3);
            border-radius: var(--hgps-size-2);
            background-color: var(--hgps-surface-3);
            color: var(--hgps-text-muted);
            font-size: 0.9rem;
            font-weight: 600;
            text-align: center;
        }

        .status.success {
            background-color: color-mix(in srgb, var(--hgps-accent) 18%, transparent);
            color: var(--hgps-accent);
            animation: pop-in 0.2s ease-out;
        }

        /* ---- Lists ---- */
        .list-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .field-label {
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03125rem;
            color: var(--hgps-text-subtle);
        }

        .section {
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-2);
        }

        .count {
            min-width: 1.25rem;
            padding: 0 var(--hgps-size-2);
            border-radius: var(--hgps-size-10);
            background-color: var(--hgps-surface-3);
            color: var(--hgps-text-muted);
            font-size: 0.72rem;
            font-weight: 700;
            line-height: 1.25rem;
            text-align: center;
        }

        .count.highlight {
            background-color: var(--hgps-accent);
            color: var(--hgps-accent-contrast);
        }

        ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-2);
        }

        li {
            display: flex;
            align-items: center;
            gap: var(--hgps-size-3);
            padding: var(--hgps-size-2) var(--hgps-size-2) var(--hgps-size-2) var(--hgps-size-3);
            background-color: var(--hgps-surface-2);
            border: thin solid transparent;
            border-radius: var(--hgps-size-3);
            transition: border-color 0.15s ease, background-color 0.15s ease;
        }

        li:hover {
            border-color: var(--hgps-border-strong);
        }

        li.outgoing {
            border-style: dashed;
            border-color: var(--hgps-border-strong);
        }

        li.request {
            background-color: color-mix(in srgb, var(--hgps-accent) 8%, var(--hgps-surface-2));
            border-color: color-mix(in srgb, var(--hgps-accent) 35%, transparent);
        }

        /* Just sent / just accepted: short highlight */
        li.new {
            animation: flash 1.6s ease-out;
        }

        /* Friend row asking "remove?" */
        li.confirming {
            border-color: color-mix(in srgb, var(--hgps-danger) 55%, transparent);
            background-color: color-mix(in srgb, var(--hgps-danger) 8%, var(--hgps-surface-2));
        }

        li.busy {
            opacity: 0.6;
        }

        .avatar {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            background-color: color-mix(in srgb, var(--avatar-color) 22%, transparent);
            border: 0.125rem solid var(--avatar-color);
            color: var(--hgps-text-strong);
            font-size: 0.85rem;
            font-weight: 700;
            letter-spacing: 0.03rem;
        }

        .info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
        }

        .name {
            font-weight: 600;
            color: var(--hgps-text-strong);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .meta {
            display: flex;
            align-items: center;
            gap: var(--hgps-size-1);
            font-size: 0.78rem;
            color: var(--hgps-text-subtle);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .row-actions {
            display: flex;
            align-items: center;
            gap: var(--hgps-size-1);
        }

        .icon-btn {
            all: unset;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.25rem;
            height: 2.25rem;
            border-radius: var(--hgps-size-2);
            color: var(--hgps-text-muted);
            cursor: pointer;
            transition: background-color 0.15s ease, color 0.15s ease;
        }

        .icon-btn:hover {
            background-color: var(--hgps-surface-3);
        }

        .icon-btn:disabled {
            cursor: progress;
        }

        .icon-btn.view:hover {
            background-color: color-mix(in srgb, var(--hgps-accent) 18%, transparent);
            color: var(--hgps-accent);
        }

        .icon-btn.accept {
            background-color: var(--hgps-accent);
            color: var(--hgps-accent-contrast);
        }

        .icon-btn.accept:hover {
            background-color: var(--hgps-accent-hover);
        }

        .icon-btn.decline {
            background-color: var(--hgps-surface-3);
        }

        .icon-btn.decline:hover,
        .icon-btn.remove:hover,
        .icon-btn.cancel:hover {
            background-color: color-mix(in srgb, var(--hgps-danger) 18%, transparent);
            color: var(--hgps-danger-text);
        }

        /* Small text buttons of the "remove?" confirmation */
        .text-btn {
            all: unset;
            display: inline-flex;
            align-items: center;
            height: 2rem;
            padding: 0 var(--hgps-size-3);
            border-radius: var(--hgps-size-2);
            font-size: 0.82rem;
            font-weight: 700;
            cursor: pointer;
            white-space: nowrap;
            transition: background-color 0.15s ease;
        }

        .text-btn.danger {
            background-color: var(--hgps-danger);
            color: #fff;
        }

        .text-btn.danger:hover {
            background-color: var(--hgps-danger-hover);
        }

        .text-btn.neutral {
            background-color: var(--hgps-surface-3);
            color: var(--hgps-text);
        }

        .icon-btn:focus-visible,
        .text-btn:focus-visible,
        .send-btn:focus-visible {
            outline: 0.125rem solid var(--hgps-accent);
            outline-offset: 0.125rem;
        }

        .empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--hgps-size-2);
            padding: var(--hgps-size-6) var(--hgps-size-4);
            border: thin dashed var(--hgps-border-strong);
            border-radius: var(--hgps-size-3);
            color: var(--hgps-text-muted);
            text-align: center;
        }

        .empty.compact {
            padding: var(--hgps-size-4);
        }

        .empty custom-icon {
            color: var(--hgps-text-faint);
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @keyframes pop-in {
            from { opacity: 0; transform: translateY(-0.25rem); }
            to { opacity: 1; transform: none; }
        }

        @keyframes flash {
            from { background-color: color-mix(in srgb, var(--hgps-accent) 25%, var(--hgps-surface-2)); }
            to { background-color: var(--hgps-surface-2); }
        }

        @media (prefers-reduced-motion: reduce) {
            .selected, .status.success, li.new { animation: none; }
            .spinner { animation-duration: 2s; }
        }

        @media (max-width: 26rem) {
            .confirm-text { white-space: normal; }
        }
    `;

    static properties = {
        _query: {state: true},
        _results: {state: true},       // null = no search done for the current text
        _searching: {state: true},
        _searchError: {state: true},
        _selected: {state: true},      // the user picked in the results
        _sending: {state: true},
        _sendError: {state: true},
        _justSentTo: {state: true},    // user id of the last request sent from this panel
        _invitations: {state: true},   // all invitations of the logged-in user
        _loaded: {state: true},
        _busy: {state: true},          // ids of invitations with an action in progress
        _highlighted: {state: true},   // invitation id to flash (just sent / just accepted)
        _confirmRemove: {state: true}, // invitation id of the friend being asked "remove?"
        _listError: {state: true},
    };

    #searchTimer = null;
    #searchSeq = 0; // to ignore answers of searches that are no longer current
    #onAuthChanged = () => this._loadInvitations();

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this._query = '';
        this._results = null;
        this._searching = false;
        this._searchError = false;
        this._selected = null;
        this._sending = false;
        this._sendError = null;
        this._justSentTo = null;
        this._invitations = [];
        this._loaded = false;
        this._busy = new Set();
        this._highlighted = null;
        this._confirmRemove = null;
        this._listError = null;
    }

    connectedCallback() {
        super.connectedCallback();
        auth.addEventListener('auth-changed', this.#onAuthChanged);
        auth.init().then(() => this._loadInvitations());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        auth.removeEventListener('auth-changed', this.#onAuthChanged);
        clearTimeout(this.#searchTimer);
    }

    // ---------------------------------------------------------------- data

    async _loadInvitations() {
        if (!auth.authenticated) {
            this._invitations = [];
            this._loaded = auth.initialized;
            return;
        }
        try {
            this._invitations = await InvitationService.list();
        } catch (e) {
            console.warn('[friends] Invitations could not be loaded', e);
        } finally {
            this._loaded = true;
        }
    }

    get _myId() {
        return auth.user?.id;
    }

    _isMine(invitation) {
        return invitation.sender.id === this._myId;
    }

    /** The other user of an invitation, seen from the logged-in user. */
    _otherUser(invitation) {
        return this._isMine(invitation) ? invitation.receiver : invitation.sender;
    }

    /** Pending requests sent by the logged-in user, newest first (the API sorts them). */
    get _sentPending() {
        return this._invitations.filter(inv => inv.status === PENDING && this._isMine(inv));
    }

    /** Pending requests received, newest first. */
    get _incoming() {
        return this._invitations.filter(inv => inv.status === PENDING && !this._isMine(inv));
    }

    /** Accepted invitations = friendships, sorted by the friend's name. */
    get _friendships() {
        return this._invitations
            .filter(inv => inv.status === ACCEPTED)
            .sort((a, b) => this._otherUser(a).displayName.localeCompare(this._otherUser(b).displayName, getLanguage()));
    }

    /** RELATION.* for this user, or null when nothing links the two users (declined ones are ignored). */
    _relationOf(userId) {
        for (const inv of this._invitations) {
            if (this._otherUser(inv).id !== userId) continue;
            if (inv.status === ACCEPTED) return RELATION.FRIEND;
            if (inv.status === PENDING) return this._isMine(inv) ? RELATION.OUTGOING : RELATION.INCOMING;
        }
        return null;
    }

    /** Replaces (or removes, when updated is null) an invitation in the local list. */
    _replaceInvitation(id, updated) {
        this._invitations = updated
            ? this._invitations.map(inv => inv.id === id ? updated : inv)
            : this._invitations.filter(inv => inv.id !== id);
    }

    // -------------------------------------------------------------- search

    /** The text actually searched: trimmed, without a leading "@". */
    get _term() {
        return this._query.trim().replace(/^@/, '');
    }

    _onInput(event) {
        this._query = event.target.value;
        this._selected = null;
        this._sendError = null;
        this._searchError = false;
        clearTimeout(this.#searchTimer);

        if (this._term.length < MIN_SEARCH_LENGTH) {
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
            // Clear the search instead of closing the dialog: the native <dialog> closes
            // on Escape unless the keydown is cancelled.
            event.preventDefault();
            event.stopPropagation();
            this._clearSearch();
        } else if (event.key === 'ArrowDown' && this._results?.length) {
            event.preventDefault();
            this.renderRoot.querySelector('.result')?.focus();
        }
    }

    /** Arrow keys move between the results; arrow up from the first one goes back to the input. */
    _onResultKeyDown(event) {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const buttons = [...this.renderRoot.querySelectorAll('.result')];
        const index = buttons.indexOf(event.currentTarget) + (event.key === 'ArrowDown' ? 1 : -1);
        (index < 0 ? this.renderRoot.querySelector('input') : buttons[index])?.focus();
    }

    async _search(term) {
        const seq = ++this.#searchSeq;
        this._searching = true;
        try {
            const results = await UserService.search(term, SEARCH_LIMIT);
            if (seq !== this.#searchSeq) return;
            this._results = results;
        } catch (e) {
            if (seq !== this.#searchSeq) return;
            console.warn('[friends] Search failed', e);
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
        this._selected = null;
        this._sendError = null;
        this.renderRoot.querySelector('input')?.focus();
    }

    _select(user) {
        this._selected = user;
        this._sendError = null;
        this.updateComplete.then(() =>
            this.renderRoot.querySelector('.selected .send-btn, .selected .deselect')?.focus());
    }

    _deselect() {
        this._selected = null;
        this._sendError = null;
        this.renderRoot.querySelector('input')?.focus();
    }

    // ------------------------------------------------------------- actions

    async _sendRequest() {
        const user = this._selected;
        this._sending = true;
        this._sendError = null;
        try {
            const invitation = await InvitationService.send(user.id);
            this._invitations = [invitation, ...this._invitations];
            this._justSentTo = user.id;
            this._highlighted = invitation.id;
        } catch (e) {
            console.warn('[friends] Friend request could not be sent', e);
            this._sendError = e.conflict ? t('friends.sendConflict') : t('friends.sendError');
            if (e.conflict) {
                await this._loadInvitations(); // shows the actual relation instead
            }
        } finally {
            this._sending = false;
        }
    }

    /**
     * Runs an action on an invitation with its row marked busy.
     * @param invitation the invitation
     * @param action     async () => the updated invitation, or null when it was deleted
     * @param errorKey   i18n key of the message shown when it fails
     */
    async _runOnInvitation(invitation, action, errorKey) {
        this._busy = new Set(this._busy).add(invitation.id);
        this._listError = null;
        try {
            const updated = await action();
            this._replaceInvitation(invitation.id, updated);
            return true;
        } catch (e) {
            console.warn(`[friends] ${errorKey}`, e);
            this._listError = t(errorKey);
            await this._loadInvitations(); // the other user may have changed it meanwhile
            return false;
        } finally {
            const busy = new Set(this._busy);
            busy.delete(invitation.id);
            this._busy = busy;
        }
    }

    async _accept(invitation) {
        if (await this._runOnInvitation(invitation, () => InvitationService.accept(invitation.id), 'friends.acceptError')) {
            this._highlighted = invitation.id; // flashes in the friends list
        }
    }

    _decline(invitation) {
        return this._runOnInvitation(invitation, () => InvitationService.decline(invitation.id), 'friends.declineError');
    }

    async _cancelRequest(invitation) {
        const done = await this._runOnInvitation(invitation,
            () => InvitationService.cancel(invitation.id).then(() => null), 'friends.cancelError');
        if (done && this._justSentTo === invitation.receiver.id) {
            this._justSentTo = null;
        }
    }

    _askRemove(invitation) {
        this._confirmRemove = invitation.id;
        this.updateComplete.then(() => this.renderRoot.querySelector('li.confirming .text-btn.neutral')?.focus());
    }

    async _removeFriend(invitation) {
        await this._runOnInvitation(invitation,
            () => InvitationService.removeFriend(invitation.id).then(() => null), 'friends.removeError');
        this._confirmRemove = null;
    }

    // ------------------------------------------------------------- helpers

    _initials(name) {
        return name.split(/\s+/).filter(Boolean).slice(0, 2)
            .map(part => part[0].toUpperCase()).join('');
    }

    _avatarColor(id) {
        const sum = [...String(id)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return AVATAR_TOKENS[sum % AVATAR_TOKENS.length];
    }

    /** The text with the searched part highlighted. */
    _highlight(text) {
        const term = this._term.toLowerCase();
        const start = term ? text.toLowerCase().indexOf(term) : -1;
        if (start < 0) return text;
        const end = start + term.length;
        return html`${text.slice(0, start)}<mark>${text.slice(start, end)}</mark>${text.slice(end)}`;
    }

    /** "5 minutes ago", "yesterday", ... in the UI language. */
    _timeAgo(isoDate) {
        const seconds = (new Date(isoDate).getTime() - Date.now()) / 1000;
        const units = [['year', 31536000], ['month', 2592000], ['week', 604800],
            ['day', 86400], ['hour', 3600], ['minute', 60]];
        const format = new Intl.RelativeTimeFormat(getLanguage(), {numeric: 'auto'});
        for (const [unit, size] of units) {
            if (Math.abs(seconds) >= size) {
                return format.format(Math.round(seconds / size), unit);
            }
        }
        return format.format(0, 'second'); // "now"
    }

    _date(isoDate) {
        return new Intl.DateTimeFormat(getLanguage(), {dateStyle: 'medium'}).format(new Date(isoDate));
    }

    _rowClass(invitation, base) {
        return [base,
            invitation.id === this._highlighted ? 'new' : '',
            this._busy.has(invitation.id) ? 'busy' : ''].filter(Boolean).join(' ');
    }

    // -------------------------------------------------------------- render

    /** @param user {id, username, displayName} */
    _renderAvatar(user) {
        return html`
            <span class="avatar" aria-hidden="true"
                  style="--avatar-color: var(${this._avatarColor(user.id)})">
                ${this._initials(user.displayName)}
            </span>`;
    }

    _renderError(message) {
        return html`
            <p class="hint error" role="alert">
                <custom-icon label="error_outline"></custom-icon>${message}
            </p>`;
    }

    _renderBadge(relation) {
        switch (relation) {
            case RELATION.FRIEND:
                return html`<span class="badge friend">${t('friends.badgeFriend')}</span>`;
            case RELATION.OUTGOING:
                return html`<span class="badge">${t('friends.badgeSent')}</span>`;
            case RELATION.INCOMING:
                return html`<span class="badge incoming">${t('friends.badgeIncoming')}</span>`;
            default:
                return html`<custom-icon class="chevron" label="chevron_right"></custom-icon>`;
        }
    }

    _renderFinderBody() {
        if (this._selected) {
            return this._renderSelected();
        }
        if (this._query.trim() && this._term.length < MIN_SEARCH_LENGTH) {
            return html`<p class="hint">${t('friends.searchHint', {count: MIN_SEARCH_LENGTH})}</p>`;
        }
        if (this._searchError) {
            return this._renderError(t('friends.searchError'));
        }
        if (this._results === null) {
            return null;
        }
        if (!this._results.length) {
            return this._searching ? null : html`
                <div class="empty compact">
                    <custom-icon label="person_off"></custom-icon>
                    <span>${t('friends.noResults', {query: this._term})}</span>
                </div>`;
        }
        return html`
            <ul class="results" aria-label="${t('friends.results')}">
                ${this._results.map(user => html`
                    <li>
                        <button class="result" type="button" @click="${() => this._select(user)}"
                                @keydown="${this._onResultKeyDown}">
                            ${this._renderAvatar(user)}
                            <div class="info">
                                <span class="name">${this._highlight(user.displayName)}</span>
                                <span class="meta">@${this._highlight(user.username)}</span>
                            </div>
                            ${this._renderBadge(this._relationOf(user.id))}
                        </button>
                    </li>`)}
            </ul>`;
    }

    _renderSelected() {
        const user = this._selected;
        return html`
            <div class="selected" aria-live="polite">
                <div class="selected-head">
                    ${this._renderAvatar(user)}
                    <div class="info">
                        <span class="name">${user.displayName}</span>
                        <span class="meta">@${user.username}</span>
                    </div>
                    <button class="icon-btn deselect" type="button"
                            title="${t('friends.backToResults')}"
                            aria-label="${t('friends.backToResults')}"
                            @click="${this._deselect}">
                        <custom-icon label="close"></custom-icon>
                    </button>
                </div>
                ${this._renderSelectedAction(user, this._relationOf(user.id))}
                ${this._sendError ? this._renderError(this._sendError) : null}
            </div>`;
    }

    _renderSelectedAction(user, relation) {
        if (relation === RELATION.FRIEND) {
            return html`
                <div class="status"><custom-icon label="how_to_reg"></custom-icon>${t('friends.alreadyFriends')}</div>`;
        }
        if (relation === RELATION.OUTGOING) {
            return this._justSentTo === user.id
                ? html`<div class="status success" role="status">
                           <custom-icon label="check_circle"></custom-icon>${t('friends.requestSent')}
                       </div>`
                : html`<div class="status"><custom-icon label="schedule"></custom-icon>${t('friends.alreadySent')}</div>`;
        }
        if (relation === RELATION.INCOMING) {
            return html`
                <div class="status">
                    <custom-icon label="mark_email_unread"></custom-icon>
                    ${t('friends.incomingFromSelected', {name: user.displayName})}
                </div>`;
        }
        return html`
            <button class="send-btn" type="button"
                    ?disabled="${this._sending}"
                    aria-label="${t('friends.sendRequestTo', {name: user.displayName})}"
                    @click="${this._sendRequest}">
                ${this._sending
                    ? html`<span class="spinner" aria-hidden="true"></span>${t('friends.sending')}`
                    : html`<custom-icon label="person_add"></custom-icon>${t('friends.sendRequest')}`}
            </button>`;
    }

    _renderSent(invitation) {
        const user = invitation.receiver;
        const busy = this._busy.has(invitation.id);
        return html`
            <li class="${this._rowClass(invitation, 'outgoing')}">
                ${this._renderAvatar(user)}
                <div class="info">
                    <span class="name">${user.displayName}</span>
                    <span class="meta">@${user.username} · ${t('friends.sentAgo', {when: this._timeAgo(invitation.createdAt)})}</span>
                </div>
                <div class="row-actions">
                    <span class="badge">${t('friends.pending')}</span>
                    <button class="icon-btn cancel" type="button" ?disabled="${busy}"
                            title="${t('friends.cancelRequest')}"
                            aria-label="${t('friends.cancelRequestTo', {name: user.displayName})}"
                            @click="${() => this._cancelRequest(invitation)}">
                        <custom-icon label="close"></custom-icon>
                    </button>
                </div>
            </li>`;
    }

    _renderIncoming(invitation) {
        const user = invitation.sender;
        const busy = this._busy.has(invitation.id);
        return html`
            <li class="${this._rowClass(invitation, 'request')}">
                ${this._renderAvatar(user)}
                <div class="info">
                    <span class="name">${user.displayName}</span>
                    <span class="meta">@${user.username} · ${this._timeAgo(invitation.createdAt)}</span>
                </div>
                <div class="row-actions">
                    <button class="icon-btn accept" type="button" ?disabled="${busy}"
                            title="${t('friends.accept')}"
                            aria-label="${t('friends.acceptNamed', {name: user.displayName})}"
                            @click="${() => this._accept(invitation)}">
                        <custom-icon label="check"></custom-icon>
                    </button>
                    <button class="icon-btn decline" type="button" ?disabled="${busy}"
                            title="${t('friends.decline')}"
                            aria-label="${t('friends.declineNamed', {name: user.displayName})}"
                            @click="${() => this._decline(invitation)}">
                        <custom-icon label="close"></custom-icon>
                    </button>
                </div>
            </li>`;
    }

    _renderFriend(invitation) {
        const friend = this._otherUser(invitation);
        const busy = this._busy.has(invitation.id);

        if (this._confirmRemove === invitation.id) {
            return html`
                <li class="${this._rowClass(invitation, 'confirming')}">
                    ${this._renderAvatar(friend)}
                    <div class="info">
                        <span class="name confirm-text">${t('friends.confirmRemove', {name: friend.displayName})}</span>
                        <span class="meta">${t('friends.confirmRemoveHint')}</span>
                    </div>
                    <div class="row-actions">
                        <button class="text-btn neutral" type="button" ?disabled="${busy}"
                                @click="${() => this._confirmRemove = null}">
                            ${t('friends.keep')}
                        </button>
                        <button class="text-btn danger" type="button" ?disabled="${busy}"
                                aria-label="${t('friends.removeNamed', {name: friend.displayName})}"
                                @click="${() => this._removeFriend(invitation)}">
                            ${t('friends.removeShort')}
                        </button>
                    </div>
                </li>`;
        }

        return html`
            <li class="${this._rowClass(invitation, '')}">
                ${this._renderAvatar(friend)}
                <div class="info">
                    <span class="name">${friend.displayName}</span>
                    <span class="meta">
                        @${friend.username} · ${t('friends.friendsSince', {date: this._date(invitation.respondedAt)})}
                    </span>
                </div>
                <div class="row-actions">
                    <button class="icon-btn view" type="button"
                            title="${t('friends.viewAreas')}"
                            aria-label="${t('friends.viewAreasOf', {name: friend.displayName})}">
                        <custom-icon label="map"></custom-icon>
                    </button>
                    <button class="icon-btn remove" type="button" ?disabled="${busy}"
                            title="${t('friends.remove')}"
                            aria-label="${t('friends.removeNamed', {name: friend.displayName})}"
                            @click="${() => this._askRemove(invitation)}">
                        <custom-icon label="person_remove"></custom-icon>
                    </button>
                </div>
            </li>`;
    }

    render() {
        const sent = this._sentPending;
        const incoming = this._incoming;
        const friendships = this._friendships;
        return html`
            <div class="finder">
                <label class="search">
                    <custom-icon label="person_search"></custom-icon>
                    <input type="search"
                           autocomplete="off"
                           spellcheck="false"
                           placeholder="${t('friends.searchPlaceholder')}"
                           aria-label="${t('friends.searchPlaceholder')}"
                           .value="${this._query}"
                           @input="${this._onInput}"
                           @keydown="${this._onKeyDown}"
                           @focus="${this._loadInvitations}">
                    ${this._searching
                        ? html`<span class="spinner" role="status" aria-label="${t('friends.searching')}"></span>`
                        : null}
                </label>
                ${this._renderFinderBody()}
            </div>

            ${this._listError ? this._renderError(this._listError) : null}

            ${incoming.length ? html`
                <section class="section" aria-labelledby="requests-label">
                    <div class="list-header">
                        <span class="field-label" id="requests-label">${t('friends.requests')}</span>
                        <span class="count highlight">${incoming.length}</span>
                    </div>
                    <ul>${incoming.map(inv => this._renderIncoming(inv))}</ul>
                </section>` : null}

            ${sent.length ? html`
                <section class="section" aria-labelledby="sent-label">
                    <div class="list-header">
                        <span class="field-label" id="sent-label">${t('friends.sent')}</span>
                        <span class="count">${sent.length}</span>
                    </div>
                    <ul>${sent.map(inv => this._renderSent(inv))}</ul>
                </section>` : null}

            <section class="section" aria-labelledby="friends-label">
                <div class="list-header">
                    <span class="field-label" id="friends-label">${t('friends.list')}</span>
                    <span class="count">${friendships.length}</span>
                </div>

                ${!this._loaded
                    ? html`<p class="hint"><span class="spinner" aria-hidden="true"></span>${t('friends.loading')}</p>`
                    : friendships.length
                        ? html`<ul>${friendships.map(inv => this._renderFriend(inv))}</ul>`
                        : html`
                            <div class="empty">
                                <custom-icon label="group_add"></custom-icon>
                                <span>${t('friends.empty')}</span>
                            </div>`}
            </section>
        `;
    }
}

customElements.define('friends-panel', FriendsPanel);
