package org.acme.notification.control;

import java.util.UUID;

/**
 * CDI event fired by {@link NotificationService} when a notification is deleted by the system
 * (not by its recipient), e.g. a friend request withdrawn by its sender.
 * {@link NotificationStream} observes it once the transaction has committed and tells the recipient live.
 *
 * @param recipientId    internal id of the recipient (User.id), never sent to the browser
 * @param notificationId public id of the deleted notification (Notification.uuid)
 */
public record NotificationRemoved(Long recipientId, UUID notificationId) {
}
