package org.acme.user.control.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.acme.user.entity.User;

import java.time.OffsetDateTime;
import java.util.UUID;

/** What the API returns for a user. */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private UUID id;
    private String username;
    private String email;
    private String displayName;
    private String language;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public static UserResponseDto from(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .language(user.getLanguage())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
