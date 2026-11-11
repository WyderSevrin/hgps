package org.acme.area.control.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.acme.area.entity.AreaVertex;

/**
 * A corner of an area's polygon. Same shape as the frontend model (models/vertex.js).
 * <p>
 * Unlike UserDto, the validation is here: a vertex is a value object whose rules
 * (valid coordinates) are the same in every use case, so there is nothing to override.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VertexDto {

    /** Position in the polygon. Returned only; on input the order of the list is used. */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer index;

    @NotNull
    @DecimalMin("-90")
    @DecimalMax("90")
    private Double lat;

    @NotNull
    @DecimalMin("-180")
    @DecimalMax("180")
    private Double lng;

    public static VertexDto from(AreaVertex vertex, int index) {
        return VertexDto.builder()
                .index(index)
                .lat(vertex.getLat())
                .lng(vertex.getLng())
                .build();
    }

    public AreaVertex toEntity() {
        return new AreaVertex(lat, lng);
    }
}
