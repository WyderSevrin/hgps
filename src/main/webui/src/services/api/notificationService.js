import {apiRequest, apiStream} from "./apiClient.js";

/**
 * Notifications of the logged-in user, from the backend (/api/notifications).
 * Returns the API objects as they are:
 *   {id, type, actor: {id, username, displayName} | null, read, createdAt}
 * type: NotificationService.TYPE.*
 * Errors are thrown as ApiError.
 *
 * Usually used through notificationStore.js, which keeps the list live.
 */
export class NotificationService {

    static TYPE = Object.freeze({FRIEND_REQUEST: 'FRIEND_REQUEST', REQUEST_ACCEPTED: 'REQUEST_ACCEPTED'});

    /** @returns {Promise<object[]>} newest first */
    static list() {
        return apiRequest('GET', '/notifications');
    }

    static async markAllRead() {
        await apiRequest('POST', '/notifications/read');
    }

    static async remove(id) {
        await apiRequest('DELETE', `/notifications/${id}`);
    }

    static async removeAll() {
        await apiRequest('DELETE', '/notifications');
    }

    /**
     * Listens to new and removed notifications until the signal aborts or the server closes the stream.
     * @param {object} handlers
     * @param {() => void}               [handlers.onOpen]
     * @param {(notification) => void}   handlers.onNotification  a new notification
     * @param {(id: string) => void}     handlers.onRemoved       a notification deleted by the system
     *                                                            (e.g. friend request withdrawn by its sender)
     * @param {AbortSignal} signal
     */
    static stream({onOpen, onNotification, onRemoved}, signal) {
        return apiStream('/notifications/stream', {
            onOpen,
            onEvent: (name, data) => {
                if (name === 'notification') onNotification(JSON.parse(data));
                else if (name === 'notification-removed') onRemoved(JSON.parse(data).id);
            },
        }, signal);
    }
}
