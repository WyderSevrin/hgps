package org.acme.region.control.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.acme.region.entity.Region;

import java.util.Map;

/**
 * What the API returns for a region. Same shape as the frontend model
 * (models/region.js, Region.fromJSON): {"code": "BE", "names": {"de": "Bern", ...}}.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegionDto {

    private String code;
    /** Name per UI language: de, fr, it, en. */
    private Map<String, String> names;

    public static RegionDto from(Region region) {
        return RegionDto.builder()
                .code(region.getCode())
                .names(Map.of(
                        "de", region.getNameDe(),
                        "fr", region.getNameFr(),
                        "it", region.getNameIt(),
                        "en", region.getNameEn()))
                .build();
    }
}
