import {auth} from '../auth/authService.js';
import {NotificationService} from '../api/notificationService.js';

const RECONNECT_MIN_DELAY = 2_000;
const RECONNECT_MAX_DELAY = 60_000;

/**
 * The logged-in user's notifications, kept live:
 *   - on login: opens the live stream, then loads the list;
 *   - each pushed notification is added to the list, each one removed by the server
 *     (e.g. friend request withdrawn by its sender) is taken out of it;
 *   - when the stream drops: reconnects with a growing delay and reloads the list,
 *     so nothing sent meanwhile is missed;
 *   - on logout: closes the stream and empties the list.
 *
 * Events:
 *   'change'        the list changed (see NotificationsController)
 *   'notification'          a new notification arrived live, detail = the notification
 *   'notification-removed'  the server removed a notification, detail = its id
 *   (e.g. the friends panel reloads its invitations on both)
 *
 * Notifications: {id, type, actor, read, createdAt: Date}
 */
class NotificationStore extends EventTarget {

    /** Newest first. */
    notifications = [];

    #abort = null;
    #reconnectDelay = RECONNECT_MIN_DELAY;

    constructor() {
        super();
        auth.addEventListener('auth-changed', () => this.#onAuthChanged());
        auth.init().then(() => this.#onAuthChanged()); // in case the login finished before this module loaded
    }

    get unreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    /** Marks all as read, here at once and then on the server. */
    async markAllRead() {
        if (!this.unreadCount) return;
        this.#set(this.notifications.map(n => ({...n, read: true})));
        await this.#onServer(() => NotificationService.markAllRead());
    }

    async remove(id) {
        this.#set(this.notifications.filter(n => n.id !== id));
        await this.#onServer(() => NotificationService.remove(id));
    }

    async clear() {
        this.#set([]);
        await this.#onServer(() => NotificationService.removeAll());
    }

    #onAuthChanged() {
        if (auth.authenticated && !this.#abort) {
            this.#connect();
        } else if (!auth.authenticated) {
            this.#disconnect();
        }
    }

    /** Keeps the stream open as long as the user is logged in. */
    async #connect() {
        const abort = new AbortController();
        this.#abort = abort;
        while (!abort.signal.aborted) {
            try {
                await NotificationService.stream({
                    onOpen: () => {
                        this.#reconnectDelay = RECONNECT_MIN_DELAY;
                        this.#load();
                    },
                    onNotification: n => this.#add(n),
                    onRemoved: id => this.#removedByServer(id),
                }, abort.signal);
            } catch (e) {
                if (abort.signal.aborted) return;
                console.warn('[notifications] Live stream interrupted', e);
            }
            await this.#waitBeforeReconnect(abort.signal);
        }
    }

    #disconnect() {
        this.#abort?.abort();
        this.#abort = null;
        this.#set([]);
    }

    async #load() {
        try {
            this.#set((await NotificationService.list()).map(toNotification));
        } catch (e) {
            console.warn('[notifications] Could not be loaded', e);
        }
    }

    #add(raw) {
        const notification = toNotification(raw);
        this.#set([notification, ...this.notifications.filter(n => n.id !== notification.id)]);
        this.dispatchEvent(new CustomEvent('notification', {detail: notification}));
    }

    #removedByServer(id) {
        this.#set(this.notifications.filter(n => n.id !== id));
        this.dispatchEvent(new CustomEvent('notification-removed', {detail: id}));
    }

    /** Runs a server update; on failure, reloads so the list shows the server's state again. */
    async #onServer(update) {
        try {
            await update();
        } catch (e) {
            console.warn('[notifications] Update failed, reloading', e);
            await this.#load();
        }
    }

    #waitBeforeReconnect(signal) {
        const delay = this.#reconnectDelay;
        this.#reconnectDelay = Math.min(delay * 2, RECONNECT_MAX_DELAY);
        return new Promise(resolve => {
            const timer = setTimeout(resolve, delay);
            signal.addEventListener('abort', () => {
                clearTimeout(timer);
                resolve();
            }, {once: true});
        });
    }

    #set(notifications) {
        this.notifications = notifications;
        this.dispatchEvent(new Event('change'));
    }
}

/** API object to the store's shape: createdAt as a Date. */
function toNotification(raw) {
    return {...raw, createdAt: new Date(raw.createdAt)};
}

export const notificationStore = new NotificationStore();

/**
 * Lit reactive controller: re-renders the host whenever the notifications change.
 *   this.notifications = new NotificationsController(this);
 */
export class NotificationsController {
    constructor(host) {
        this.host = host;
        this._onChange = () => host.requestUpdate();
        host.addController(this);
    }

    hostConnected() {
        notificationStore.addEventListener('change', this._onChange);
    }

    hostDisconnected() {
        notificationStore.removeEventListener('change', this._onChange);
    }
}
