import {LitElement, html, css} from 'lit';
import '../icon/icon.js';
import {I18nController, getLanguage, t} from '../../services/i18n/i18n.js';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Placeholder data until notifications come from the backend.
// `type` picks the icon and the translated message (notifications.types.<type>).
const sampleNotifications = () => {
    const now = Date.now();
    return [
        {id: 'n1', type: 'friendRequest', params: {name: 'Emma Weber'}, date: new Date(now - 4 * MINUTE), read: false},
        {id: 'n2', type: 'areaShared', params: {name: 'Alice Martin', area: 'Aare bend'}, date: new Date(now - 2 * HOUR), read: false},
        {id: 'n3', type: 'requestAccepted', params: {name: 'Bruno Keller'}, date: new Date(now - DAY - 3 * HOUR), read: true},
        {id: 'n4', type: 'friendRequest', params: {name: 'Lukas Huber'}, date: new Date(now - 3 * DAY), read: true},
    ];
};

const TYPE_ICONS = {
    friendRequest: 'person_add',
    requestAccepted: 'how_to_reg',
    areaShared: 'map',
};

/**
 * Header notification button with an unread badge. Clicking it opens a
 * bubble anchored under the button listing notifications with timestamps.
 * Closes on a second click, Escape, or a click anywhere outside.
 *
 * @property {Array<{id, type, params, date: Date, read: boolean}>} notifications
 */
export class NotificationsMenu extends LitElement {
    static styles = css`
        :host {
            position: relative;
            display: inline-flex;
        }

        .trigger {
            all: unset;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: var(--hgps-header-control);
            border: 1px solid var(--hgps-gold);
            color: var(--hgps-gold-bright);
            cursor: pointer;
            transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        .trigger:hover,
        :host([open]) .trigger {
            background-color: var(--hgps-header-control-hover);
            border-color: var(--hgps-gold-bright);
        }

        .trigger:focus-visible {
            outline: none;
            border-color: var(--hgps-gold-bright);
            box-shadow: 0 0 0 2px var(--hgps-accent-ring);
        }

        .badge {
            position: absolute;
            top: -4px;
            right: -4px;
            min-width: 18px;
            height: 18px;
            padding: 0 4px;
            box-sizing: border-box;
            border-radius: 9px;
            background-color: var(--hgps-danger);
            color: var(--hgps-text-strong);
            border: 2px solid var(--hgps-slate-deep);
            font-size: 10px;
            font-weight: 700;
            line-height: 14px;
            text-align: center;
        }

        /* ---- Bubble ---- */
        .bubble {
            position: absolute;
            top: calc(100% + 12px);
            right: -8px;
            width: min(22rem, calc(100vw - 24px));
            box-sizing: border-box;
            background-color: var(--hgps-surface);
            border: thin solid var(--hgps-border);
            border-radius: var(--hgps-size-3);
            box-shadow: 0 0.625rem 1.875rem var(--hgps-shadow);
            color: var(--hgps-text);
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            transform-origin: top right;
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
            visibility: hidden;
            transition: opacity 0.15s ease, transform 0.15s ease, visibility 0s linear 0.15s;
        }

        :host([open]) .bubble {
            opacity: 1;
            transform: none;
            visibility: visible;
            transition: opacity 0.15s ease, transform 0.15s ease;
        }

        /* Arrow pointing at the button */
        .bubble::before {
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

        .bubble-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--hgps-size-3) var(--hgps-size-4);
            border-bottom: thin solid var(--hgps-border);
        }

        .bubble-title {
            margin: 0;
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--hgps-text-strong);
        }

        .unread-count {
            font-size: 0.75rem;
            color: var(--hgps-text-subtle);
        }

        ul {
            list-style: none;
            margin: 0;
            padding: var(--hgps-size-1);
            max-height: min(60vh, 24rem);
            overflow-y: auto;
        }

        li {
            display: flex;
            align-items: flex-start;
            gap: var(--hgps-size-3);
            padding: var(--hgps-size-3);
            border-radius: var(--hgps-size-2);
        }

        li:hover {
            background-color: var(--hgps-surface-2);
        }

        .type-icon {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 50%;
            background-color: var(--hgps-surface-3);
            color: var(--hgps-text-muted);
        }

        li.unread .type-icon {
            background-color: color-mix(in srgb, var(--hgps-accent) 20%, transparent);
            color: var(--hgps-accent);
        }

        .text {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
        }

        .message {
            font-size: 0.86rem;
            line-height: 1.35;
            color: var(--hgps-text-muted);
        }

        li.unread .message {
            color: var(--hgps-text-strong);
        }

        time {
            font-size: 0.74rem;
            color: var(--hgps-text-subtle);
        }

        .dot {
            flex: 0 0 auto;
            width: 0.5rem;
            height: 0.5rem;
            margin-top: 0.4rem;
            border-radius: 50%;
            background-color: var(--hgps-accent);
        }

        .empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--hgps-size-2);
            padding: var(--hgps-size-6) var(--hgps-size-4);
            color: var(--hgps-text-muted);
            font-size: 0.86rem;
            text-align: center;
        }

        .empty custom-icon {
            color: var(--hgps-text-faint);
        }

        @media (prefers-reduced-motion: reduce) {
            .bubble, :host([open]) .bubble { transition: none; }
        }
    `;

    static properties = {
        open: {type: Boolean, reflect: true},
        notifications: {type: Array},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.open = false;
        this.notifications = sampleNotifications();
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

    // composedPath() crosses shadow roots, so clicks inside the bubble count as inside.
    _onDocumentClick(event) {
        if (this.open && !event.composedPath().includes(this)) this.open = false;
    }

    _onKeyDown(event) {
        if (this.open && event.key === 'Escape') {
            this.open = false;
            this.shadowRoot.querySelector('.trigger')?.focus();
        }
    }

    // "5 min ago", "yesterday", ... in the current language.
    _relativeTime(date) {
        const diff = date.getTime() - Date.now();
        const rtf = new Intl.RelativeTimeFormat(getLanguage(), {numeric: 'auto', style: 'short'});
        const abs = Math.abs(diff);
        if (abs < MINUTE) return rtf.format(0, 'second');
        if (abs < HOUR) return rtf.format(Math.round(diff / MINUTE), 'minute');
        if (abs < DAY) return rtf.format(Math.round(diff / HOUR), 'hour');
        if (abs < 7 * DAY) return rtf.format(Math.round(diff / DAY), 'day');
        return this._fullDate(date);
    }

    _fullDate(date) {
        return new Intl.DateTimeFormat(getLanguage(), {dateStyle: 'medium', timeStyle: 'short'}).format(date);
    }

    _renderNotification(n) {
        return html`
            <li class="${n.read ? '' : 'unread'}">
                <span class="type-icon" aria-hidden="true">
                    <custom-icon label="${TYPE_ICONS[n.type] ?? 'notifications'}"></custom-icon>
                </span>
                <div class="text">
                    <span class="message">${t(`notifications.types.${n.type}`, n.params)}</span>
                    <time datetime="${n.date.toISOString()}" title="${this._fullDate(n.date)}">
                        ${this._relativeTime(n.date)}
                    </time>
                </div>
                ${n.read ? null : html`<span class="dot" aria-label="${t('notifications.unread')}"></span>`}
            </li>`;
    }

    render() {
        const notifications = [...(this.notifications ?? [])].sort((a, b) => b.date - a.date);
        const unread = notifications.filter(n => !n.read).length;
        const label = unread
            ? `${t('notifications.title')} (${t('notifications.unreadCount', {count: unread})})`
            : t('notifications.title');

        return html`
            <button class="trigger"
                    title="${label}"
                    aria-label="${label}"
                    aria-haspopup="true"
                    aria-expanded="${this.open}"
                    aria-controls="bubble"
                    @click="${() => this.open = !this.open}">
                <custom-icon label="notifications"></custom-icon>
                ${unread ? html`<span class="badge" aria-hidden="true">${unread > 9 ? '9+' : unread}</span>` : null}
            </button>

            <div class="bubble" id="bubble" role="region" aria-labelledby="bubble-title" ?inert="${!this.open}">
                <div class="bubble-header">
                    <h2 class="bubble-title" id="bubble-title">${t('notifications.title')}</h2>
                    ${unread ? html`<span class="unread-count">${t('notifications.unreadCount', {count: unread})}</span>` : null}
                </div>
                ${notifications.length
                    ? html`<ul>${notifications.map(n => this._renderNotification(n))}</ul>`
                    : html`
                        <div class="empty">
                            <custom-icon label="notifications_off"></custom-icon>
                            <span>${t('notifications.empty')}</span>
                        </div>`}
            </div>
        `;
    }
}

customElements.define('notifications-menu', NotificationsMenu);
