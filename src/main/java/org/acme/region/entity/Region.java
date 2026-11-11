package org.acme.region.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

/**
 * A Swiss region (canton), see V1__create_base_schema.sql.
 * Reference data used like an enum: the rows are inserted by the migration and
 * never changed by the application, hence {@link Immutable} and no setters.
 */
@Entity
@Table(name = "region")
@Immutable
@Getter
@NoArgsConstructor
public class Region {

    /** The two-letter canton abbreviation (BE, LU, ...), also the key used by the API. */
    @Id
    @Column(length = 2)
    private String code;

    @Column(name = "name_de", nullable = false, length = 50)
    private String nameDe;

    @Column(name = "name_fr", nullable = false, length = 50)
    private String nameFr;

    @Column(name = "name_it", nullable = false, length = 50)
    private String nameIt;

    @Column(name = "name_en", nullable = false, length = 50)
    private String nameEn;
}
