package org.acme.notification.control.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.acme.notification.entity.Notification;
import org.acme.notification.entity.NotificationType;
import org.acme.user.control.dto.UserPublicDto;

import java.time.OffsetDateTime;
import java.util.UUID;

/** What the API returns for a notification, in the list and in the live stream. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

    /** The public identifier (Notification.uuid). */
    private UUID id;
    private NotificationType type;
    /** Who caused it, null for a notification without actor. */
    private UserPublicDto actor;
    private boolean read;
    private OffsetDateTime createdAt;

    public static NotificationDto from(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getUuid())
                .type(notification.getType())
                .actor(notification.getActor() != null ? UserPublicDto.from(notification.getActor()) : null)
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
