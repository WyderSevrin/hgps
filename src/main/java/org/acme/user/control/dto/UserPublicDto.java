package org.acme.user.control.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.acme.user.entity.User;

import java.util.UUID;

/**
 * Another user as everyone may see them (invitation sender/receiver, area owner, ...).
 * Deliberately smaller than UserDto: no e-mail or language of other users.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPublicDto {

    /** The public identifier (User.uuid). */
    private UUID id;
    private String username;
    private String displayName;

    public static UserPublicDto from(User user) {
        return UserPublicDto.builder()
                .id(user.getUuid())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .build();
    }
}
