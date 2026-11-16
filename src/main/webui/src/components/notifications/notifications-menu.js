import {LitElement, html} from 'lit';
import { headerControlStyles, popoverStyles, emptyStateStyles } from '../../styles/shared.styles.js';
import { notificationsMenuStyles } from './notifications-menu.styles.js';
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
    static styles = [headerControlStyles, popoverStyles, emptyStateStyles, notificationsMenuStyles];

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
            <button class="trigger header-control"
                    title="${label}"
                    aria-label="${label}"
                    aria-haspopup="true"
                    aria-expanded="${this.open}"
                    aria-controls="bubble"
                    @click="${() => this.open = !this.open}">
                <custom-icon label="notifications"></custom-icon>
                ${unread ? html`<span class="badge" aria-hidden="true">${unread > 9 ? '9+' : unread}</span>` : null}
            </button>

            <div class="bubble popover" id="bubble" role="region" aria-labelledby="bubble-title" ?inert="${!this.open}">
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
