package org.acme.notification.control;

import org.acme.notification.control.dto.NotificationDto;

/**
 * CDI event fired by {@link NotificationService} when a notification is stored.
 * {@link NotificationStream} observes it once the transaction has committed and pushes it live.
 *
 * @param recipientId internal id of the recipient (User.id), never sent to the browser
 */
public record NotificationCreated(Long recipientId, NotificationDto notification) {
}
