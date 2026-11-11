package org.acme.area.control.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.acme.area.entity.Area;
import org.acme.user.control.dto.UserPublicDto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

/**
 * An area as the API returns it, and the base of the input DTOs (e.g. {@link AreaCreateDto}).
 * Same pattern as UserDto: no validation here, server-generated fields are READ_ONLY.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AreaDto {

    /** The public identifier (Area.uuid). */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    /** Always the logged-in user on creation, never taken from the request. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UserPublicDto owner;

    private String name;
    private String description;

    /** 0 = not determined yet, 1..5 = increasing presence. */
    private Integer goldPresence;

    /** "private" in JSON, like the frontend model (a Java field cannot be named private). */
    @JsonProperty("private")
    private Boolean isPrivate;

    /** Canton code (BE, LU, ...), null while not set. See GET /api/regions. */
    private String region;

    /** The polygon corners, in order. */
    private List<VertexDto> vertices;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private OffsetDateTime createdAt;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private OffsetDateTime updatedAt;

    public static AreaDto from(Area area) {
        return AreaDto.builder()
                .id(area.getUuid())
                .owner(UserPublicDto.from(area.getOwner()))
                .name(area.getName())
                .description(area.getDescription())
                .goldPresence(area.getGoldPresence())
                .isPrivate(area.isPrivate())
                .region(area.getRegion() != null ? area.getRegion().getCode() : null)
                .vertices(IntStream.range(0, area.getVertices().size())
                        .mapToObj(i -> VertexDto.from(area.getVertices().get(i), i))
                        .toList())
                .createdAt(area.getCreatedAt())
                .updatedAt(area.getUpdatedAt())
                .build();
    }
}
