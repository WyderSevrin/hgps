package org.acme.invitation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.acme.user.entity.User;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UuidGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * A friend invitation from one user to another, see V1__create_base_schema.sql.
 * Two users are friends when an invitation between them is {@link InvitationStatus#ACCEPTED}.
 * <p>
 * Two identifiers like {@link User}: {@link #id} is internal, {@link #uuid} is the "id" of the API.
 * No @Data on purpose: Lombok's equals/hashCode/toString do not play well with JPA entities.
 */
@Entity
@Table(name = "friend_invitation")
@Getter
@Setter
@NoArgsConstructor
public class FriendInvitation {

    /** Internal key. allocationSize must match the sequence's INCREMENT BY in the migration. */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "friend_invitation_seq")
    @SequenceGenerator(name = "friend_invitation_seq", sequenceName = "friend_invitation_seq", allocationSize = 50)
    @Setter(AccessLevel.NONE)
    private Long id;

    /** Public identifier, a time-ordered UUIDv7 generated on insert. */
    @UuidGenerator(style = UuidGenerator.Style.VERSION_7)
    @Column(nullable = false, unique = true, updatable = false)
    @Setter(AccessLevel.NONE)
    private UUID uuid;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id", nullable = false, updatable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_id", nullable = false, updatable = false)
    private User receiver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private InvitationStatus status = InvitationStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    @Setter(AccessLevel.NONE)
    private OffsetDateTime createdAt;

    /** Set when the invitation leaves PENDING (ck_friend_invitation_responded). */
    @Column(name = "responded_at")
    private OffsetDateTime respondedAt;
}
