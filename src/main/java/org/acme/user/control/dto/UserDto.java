package org.acme.user.control.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.acme.user.entity.User;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * A user as the API returns it, and the base of the input DTOs (e.g. {@link UserCreateDto}).
 * <p>
 * No validation here on purpose: Bean Validation constraints are inherited and cannot be
 * removed by a subclass, so each input DTO adds its own rules on overridden getters.
 * <p>
 * Server-generated fields are READ_ONLY: returned in responses, ignored when a client sends them.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    /** The public identifier (User.uuid); the internal database id is never exposed. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    private String username;
    private String email;
    private String displayName;
    private String language;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private OffsetDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private OffsetDateTime updatedAt;

    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getUuid())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .language(user.getLanguage())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
