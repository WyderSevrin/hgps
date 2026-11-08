import {LitElement, html, css} from 'lit';
import '../icon/icon.js';
import {I18nController, t} from '../../services/i18n/i18n.js';

// Placeholder data until friends come from the backend.
const SAMPLE_FRIENDS = [
    {id: '1', name: 'Alice Martin', handle: 'alice.m', areaCount: 7},
    {id: '2', name: 'Bruno Keller', handle: 'bkeller', areaCount: 2},
    {id: '3', name: 'Chiara Rossi', handle: 'chiara', areaCount: 1},
    {id: '4', name: 'David Meier', handle: 'dmeier', areaCount: 0},
];

// Placeholder: incoming requests waiting for approval.
const SAMPLE_REQUESTS = [
    {id: '10', name: 'Emma Weber', handle: 'emma.w', areaCount: 4},
    {id: '11', name: 'Lukas Huber', handle: 'lhuber', areaCount: 0},
];

// Avatar tints, picked deterministically from the friend's id.
const AVATAR_TOKENS = [
    '--hgps-gold-level-1', '--hgps-gold-level-2', '--hgps-gold-level-3',
    '--hgps-gold-level-4', '--hgps-gold-level-5',
];

/**
 * Friends panel: a search bar to add a friend, the incoming friend requests
 * waiting for approval and the list of friends.
 * The interactions (add, accept, decline, view areas, remove) are visual
 * placeholders only.
 *
 * @property {Array<{id, name, handle, areaCount}>} friends
 * @property {Array<{id, name, handle, areaCount}>} requests - pending incoming requests
 */
export class FriendsPanel extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-4);
        }

        /* ---- Add friend ---- */
        .add {
            display: flex;
            gap: var(--hgps-size-2);
        }

        .search {
            flex: 1;
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
            height: 2.5rem;
            border: none;
            outline: none;
            background: transparent;
            color: var(--hgps-text);
            font: inherit;
            font-size: 0.9rem;
        }

        .search input::placeholder {
            color: var(--hgps-text-faint);
        }

        .add-btn {
            display: inline-flex;
            align-items: center;
            gap: var(--hgps-size-1);
            padding: 0 var(--hgps-size-4);
            border: none;
            border-radius: var(--hgps-size-2);
            background-color: var(--hgps-accent);
            color: var(--hgps-accent-contrast);
            font: inherit;
            font-size: 0.88rem;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.15s ease, opacity 0.15s ease;
        }

        .add-btn:hover:not(:disabled) {
            background-color: var(--hgps-accent-hover);
        }

        .add-btn:disabled {
            opacity: 0.45;
            cursor: not-allowed;
        }

        /* ---- List ---- */
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

        .icon-btn.view:hover {
            background-color: color-mix(in srgb, var(--hgps-accent) 18%, transparent);
            color: var(--hgps-accent);
        }

        .count.highlight {
            background-color: var(--hgps-accent);
            color: var(--hgps-accent-contrast);
        }

        li.request {
            background-color: color-mix(in srgb, var(--hgps-accent) 8%, var(--hgps-surface-2));
            border-color: color-mix(in srgb, var(--hgps-accent) 35%, transparent);
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
        .icon-btn.remove:hover {
            background-color: color-mix(in srgb, var(--hgps-danger) 18%, transparent);
            color: var(--hgps-danger-text);
        }

        .icon-btn:focus-visible,
        .add-btn:focus-visible {
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

        .empty custom-icon {
            color: var(--hgps-text-faint);
        }

        @media (max-width: 26rem) {
            .add-btn span { display: none; }
            .add-btn { padding: 0 var(--hgps-size-3); }
        }
    `;

    static properties = {
        friends: {type: Array},
        requests: {type: Array},
        _query: {state: true},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.friends = SAMPLE_FRIENDS;
        this.requests = SAMPLE_REQUESTS;
        this._query = '';
    }

    _initials(name) {
        return name.split(/\s+/).filter(Boolean).slice(0, 2)
            .map(part => part[0].toUpperCase()).join('');
    }

    _avatarColor(id) {
        const sum = [...String(id)].reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return AVATAR_TOKENS[sum % AVATAR_TOKENS.length];
    }

    // Placeholder: adding a friend is not implemented yet.
    _onAdd(event) {
        event.preventDefault();
    }

    _renderAvatar(person) {
        return html`
            <span class="avatar" aria-hidden="true"
                  style="--avatar-color: var(${this._avatarColor(person.id)})">
                ${this._initials(person.name)}
            </span>`;
    }

    _renderRequest(request) {
        return html`
            <li class="request">
                ${this._renderAvatar(request)}
                <div class="info">
                    <span class="name">${request.name}</span>
                    <span class="meta">@${request.handle} · ${t('friends.wantsToBeFriend')}</span>
                </div>
                <div class="row-actions">
                    <button class="icon-btn accept"
                            title="${t('friends.accept')}"
                            aria-label="${t('friends.acceptNamed', {name: request.name})}">
                        <custom-icon label="check"></custom-icon>
                    </button>
                    <button class="icon-btn decline"
                            title="${t('friends.decline')}"
                            aria-label="${t('friends.declineNamed', {name: request.name})}">
                        <custom-icon label="close"></custom-icon>
                    </button>
                </div>
            </li>`;
    }

    _renderFriend(friend) {
        return html`
            <li>
                ${this._renderAvatar(friend)}
                <div class="info">
                    <span class="name">${friend.name}</span>
                    <span class="meta">
                        @${friend.handle} · ${t('friends.areas', {count: friend.areaCount})}
                    </span>
                </div>
                <div class="row-actions">
                    <button class="icon-btn view"
                            title="${t('friends.viewAreas')}"
                            aria-label="${t('friends.viewAreasOf', {name: friend.name})}">
                        <custom-icon label="map"></custom-icon>
                    </button>
                    <button class="icon-btn remove"
                            title="${t('friends.remove')}"
                            aria-label="${t('friends.removeNamed', {name: friend.name})}">
                        <custom-icon label="person_remove"></custom-icon>
                    </button>
                </div>
            </li>`;
    }

    render() {
        const friends = this.friends ?? [];
        const requests = this.requests ?? [];
        return html`
            <form class="add" @submit="${this._onAdd}">
                <label class="search">
                    <custom-icon label="person_search"></custom-icon>
                    <input type="search"
                           placeholder="${t('friends.searchPlaceholder')}"
                           aria-label="${t('friends.searchPlaceholder')}"
                           .value="${this._query}"
                           @input="${e => this._query = e.target.value}">
                </label>
                <button class="add-btn" type="submit" ?disabled="${!this._query.trim()}">
                    <custom-icon label="person_add"></custom-icon>
                    <span>${t('friends.add')}</span>
                </button>
            </form>

            ${requests.length ? html`
                <section class="section" aria-labelledby="requests-label">
                    <div class="list-header">
                        <span class="field-label" id="requests-label">${t('friends.requests')}</span>
                        <span class="count highlight">${requests.length}</span>
                    </div>
                    <ul>${requests.map(r => this._renderRequest(r))}</ul>
                </section>` : null}

            <section class="section" aria-labelledby="friends-label">
                <div class="list-header">
                    <span class="field-label" id="friends-label">${t('friends.list')}</span>
                    <span class="count">${friends.length}</span>
                </div>

                ${friends.length
                    ? html`<ul>${friends.map(f => this._renderFriend(f))}</ul>`
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
