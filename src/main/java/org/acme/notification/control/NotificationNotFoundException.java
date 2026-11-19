package org.acme.notification.control;

import java.util.UUID;

/**
 * Thrown when a notification does not exist, or belongs to another user:
 * notifications of other users are reported as not found rather than forbidden.
 */
public class NotificationNotFoundException extends RuntimeException {

    public NotificationNotFoundException(UUID id) {
        super("Notification " + id + " not found");
    }
}
