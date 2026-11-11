package org.acme.area.control.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.acme.area.entity.Area;

import java.util.List;

/**
 * Body of POST and PUT /api/areas: the fields of {@link AreaDto} with the validation rules
 * for creating an area. The rules match the constraints of the area table.
 * Same pattern as UserCreateDto: constraints on overridden getters, inherited
 * server-generated fields (id, owner, timestamps) are READ_ONLY.
 */
public class AreaCreateDto extends AreaDto {

    @Override
    @NotBlank
    @Size(max = 100)
    public String getName() {
        return super.getName();
    }

    /** Optional. */
    @Override
    @Size(max = 5000)
    public String getDescription() {
        return super.getDescription();
    }

    /** Optional, defaults to 0 (not determined yet). */
    @Override
    @Min(Area.GOLD_PRESENCE_MIN)
    @Max(Area.GOLD_PRESENCE_MAX)
    public Integer getGoldPresence() {
        return super.getGoldPresence();
    }

    /** Optional, defaults to true: an area is private unless shared on purpose. */
    @Override
    public Boolean getIsPrivate() {
        return super.getIsPrivate();
    }

    /** Optional canton code, case-insensitive; must exist (checked by the service). */
    @Override
    @Pattern(regexp = "[A-Za-z]{2}", message = "must be a two-letter canton code, e.g. BE")
    public String getRegion() {
        return super.getRegion();
    }

    /** A polygon needs at least 3 corners. */
    @Override
    @NotNull
    @Size(min = 3, max = 1000)
    public List<@NotNull @Valid VertexDto> getVertices() {
        return super.getVertices();
    }
}
