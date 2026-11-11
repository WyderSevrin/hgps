package org.acme.area.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * A corner of an area's polygon, stored in area_vertex.
 * Only exists as part of its {@link Area}: its order in Area.vertices is the
 * "position" column, so it needs no identity of its own in Java.
 */
@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AreaVertex {

    @Column(nullable = false)
    private double lat;

    @Column(nullable = false)
    private double lng;
}
