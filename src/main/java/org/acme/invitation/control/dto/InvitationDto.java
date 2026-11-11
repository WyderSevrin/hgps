package org.acme.invitation.control.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.acme.invitation.entity.FriendInvitation;
import org.acme.invitation.entity.InvitationStatus;
import org.acme.user.control.dto.UserPublicDto;

import java.time.OffsetDateTime;
import java.util.UUID;

/** What the API returns for an invitation. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDto {

    /** The public identifier (FriendInvitation.uuid). */
    private UUID id;
    private UserPublicDto sender;
    private UserPublicDto receiver;
    private InvitationStatus status;
    private OffsetDateTime createdAt;
    private OffsetDateTime respondedAt;

    public static InvitationDto from(FriendInvitation invitation) {
        return InvitationDto.builder()
                .id(invitation.getUuid())
                .sender(UserPublicDto.from(invitation.getSender()))
                .receiver(UserPublicDto.from(invitation.getReceiver()))
                .status(invitation.getStatus())
                .createdAt(invitation.getCreatedAt())
                .respondedAt(invitation.getRespondedAt())
                .build();
    }
}
