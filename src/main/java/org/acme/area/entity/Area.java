package org.acme.area.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.acme.region.entity.Region;
import org.acme.user.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * A zone drawn on the map by a user, see V1__create_base_schema.sql.
 * <p>
 * Two identifiers like {@link User}: {@link #id} is internal, {@link #uuid} is the "id" of the API.
 * No @Data on purpose: Lombok's equals/hashCode/toString do not play well with JPA entities.
 */
@Entity
@Table(name = "area")
@Getter
@Setter
@NoArgsConstructor
public class Area {

    public static final int GOLD_PRESENCE_MIN = 0; // 0 = not determined yet
    public static final int GOLD_PRESENCE_MAX = 5;

    /** Internal key. allocationSize must match the sequence's INCREMENT BY in the migration. */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "area_seq")
    @SequenceGenerator(name = "area_seq", sequenceName = "area_seq", allocationSize = 50)
    @Setter(AccessLevel.NONE)
    private Long id;

    /** Public identifier, a time-ordered UUIDv7 generated on insert. */
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, unique = true, updatable = false)
    @Setter(AccessLevel.NONE)
    private UUID uuid;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false, updatable = false)
    private User owner;

    /** The canton the area lies in, null while not set. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_code")
    private Region region;

    @Column(nullable = false, length = 100)
    private String name;

    private String description;

    /** 0 = not determined yet, 1..5 = increasing presence. SMALLINT in the table, int in Java. */
    @Column(name = "gold_presence", nullable = false)
    @JdbcTypeCode(SqlTypes.SMALLINT)
    private int goldPresence = GOLD_PRESENCE_MIN;

    /** Private areas are only visible to their owner. */
    @Column(name = "is_private", nullable = false)
    private boolean isPrivate = true;

    /** The polygon corners, in order; the list index is the "position" column. */
    @ElementCollection
    @CollectionTable(name = "area_vertex", joinColumns = @JoinColumn(name = "area_id"))
    @OrderColumn(name = "position")
    @Setter(AccessLevel.NONE)
    private List<AreaVertex> vertices = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private OffsetDateTime createdAt;

    /**
     * Set by {@link #markUpdated()} rather than @UpdateTimestamp: a change of the vertices
     * alone does not update the area row, so @UpdateTimestamp would miss it.
     */
    @Column(name = "updated_at", nullable = false)
    @Setter(AccessLevel.NONE)
    private OffsetDateTime updatedAt;

    /** Replaces the polygon corners, keeping the given order. */
    public void replaceVertices(List<AreaVertex> newVertices) {
        vertices.clear();
        vertices.addAll(newVertices);
    }

    public void markUpdated() {
        updatedAt = OffsetDateTime.now();
    }

    public boolean isOwnedBy(User user) {
        return owner.getId().equals(user.getId());
    }
}
