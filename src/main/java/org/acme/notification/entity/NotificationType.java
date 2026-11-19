package org.acme.notification.entity;

/**
 * What a notification is about. Stored as text (ck_notification_type in V7__create_notification.sql)
 * and translated in the frontend (notificationStore.js / notifications.types.*).
 * A new type needs: a value here, the check constraint, and a frontend translation.
 */
public enum NotificationType {
    /** The actor sent the recipient a friend request. */
    FRIEND_REQUEST,
    /** The actor accepted the recipient's friend request. */
    REQUEST_ACCEPTED
}
