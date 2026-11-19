import {LitElement, html} from 'lit';
import { headerControlStyles, popoverStyles, emptyStateStyles } from '../../styles/shared.styles.js';
import { notificationsMenuStyles } from './notifications-menu.styles.js';
import '../icon/icon.js';
import {I18nController, getLanguage, t} from '../../services/i18n/i18n.js';
import {notificationStore, NotificationsController} from '../../services/notifications/notificationStore.js';
import {NotificationService} from '../../services/api/notificationService.js';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Per backend type: the icon and the translated message (notifications.types.<key>)
const {FRIEND_REQUEST, REQUEST_ACCEPTED} = NotificationService.TYPE;
const TYPES = {
    [FRIEND_REQUEST]: {icon: 'person_add', key: 'friendRequest'},
    [REQUEST_ACCEPTED]: {icon: 'how_to_reg', key: 'requestAccepted'},
};

/**
 * Header notification button with an unread badge. Clicking it opens a
 * bubble anchored under the button listing notifications with timestamps.
 * Closes on a second click, Escape, or a click anywhere outside.
 *
 * The notifications come live from notificationStore. Opening the bubble marks
 * them all as read (the badge goes away); the ones that were unread stay
 * highlighted until the bubble closes, so the user still sees what is new.
 * Each notification can be cleared, or all at once.
 */
export class NotificationsMenu extends LitElement {
    static styles = [headerControlStyles, popoverStyles, emptyStateStyles, notificationsMenuStyles];

    static properties = {
        open: {type: Boolean, reflect: true},
    };

    /** Ids of the notifications that were unread when the bubble opened. */
    #newIds = new Set();

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.notifications = new NotificationsController(this);
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

    willUpdate(changed) {
        if (!changed.has('open')) return;
        if (this.open) {
            this.#newIds = new Set(notificationStore.notifications.filter(n => !n.read).map(n => n.id));
            notificationStore.markAllRead();
        } else {
            this.#newIds = new Set();
        }
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
        const type = TYPES[n.type];
        if (!type) return null; // a type this frontend does not know yet
        const isNew = !n.read || this.#newIds.has(n.id);
        return html`
            <li class="${isNew ? 'unread' : ''}">
                <span class="type-icon" aria-hidden="true">
                    <custom-icon label="${type.icon}"></custom-icon>
                </span>
                <div class="text">
                    <span class="message">${t(`notifications.types.${type.key}`, {name: n.actor?.displayName})}</span>
                    <time datetime="${n.createdAt.toISOString()}" title="${this._fullDate(n.createdAt)}">
                        ${this._relativeTime(n.createdAt)}
                    </time>
                </div>
                ${isNew ? html`<span class="dot" aria-label="${t('notifications.unread')}"></span>` : null}
                <button class="dismiss"
                        title="${t('notifications.dismiss')}"
                        aria-label="${t('notifications.dismiss')}"
                        @click="${() => notificationStore.remove(n.id)}">
                    <custom-icon label="close"></custom-icon>
                </button>
            </li>`;
    }

    render() {
        const notifications = notificationStore.notifications;
        const unread = notificationStore.unreadCount;
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
                    ${notifications.length
                        ? html`<button class="clear-all" @click="${() => notificationStore.clear()}">
                                   ${t('notifications.clearAll')}
                               </button>`
                        : null}
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
