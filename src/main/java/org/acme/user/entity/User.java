package org.acme.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * A user of the application. Mapped to {@code app_user}
 * ("user" is a reserved word in PostgreSQL), see V1__create_base_schema.sql.
 * <p>
 * No @Data on purpose: Lombok's equals/hashCode/toString do not play well with JPA entities.
 */
@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)
    private UUID id;

    /** The "@handle", always stored in lower case. */
    @Column(nullable = false, length = 30)
    private String username;

    @Column(nullable = false)
    private String email;

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;

    /** UI language: en, de, fr or it. */
    @Column(nullable = false, length = 2)
    private String language;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    @Setter(AccessLevel.NONE)
    private OffsetDateTime updatedAt;
}
