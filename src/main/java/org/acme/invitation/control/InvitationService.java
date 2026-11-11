package org.acme.invitation.control;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.acme.invitation.control.dto.InvitationDto;
import org.acme.invitation.entity.FriendInvitation;
import org.acme.invitation.entity.InvitationStatus;
import org.acme.user.control.TokenUser;
import org.acme.user.control.UserService;
import org.acme.user.entity.User;
import org.hibernate.exception.ConstraintViolationException;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Business logic and persistence for friend invitations.
 * Every method acts on behalf of the logged-in user (the token), who only ever
 * sees invitations they sent or received.
 * <p>
 * Lifecycle: PENDING, then ACCEPTED or DECLINED (by the receiver) or CANCELLED (by the sender).
 * <p>
 * All methods are transactional because resolving the logged-in user may create it (first login).
 */
@ApplicationScoped
@RequiredArgsConstructor
public class InvitationService {

    private final EntityManager em;
    private final UserService userService;

    /**
     * The invitations of the logged-in user, newest first.
     *
     * @param direction INCOMING, OUTGOING, or null for both
     * @param status    only this status, or null for all
     */
    @Transactional
    public List<InvitationDto> findForUser(TokenUser token, InvitationDirection direction, InvitationStatus status) {
        User me = userService.currentUser(token);

        String participant = direction == null ? "(i.sender = :me OR i.receiver = :me)"
                : direction == InvitationDirection.INCOMING ? "i.receiver = :me"
                : "i.sender = :me";
        String jpql = "SELECT i FROM FriendInvitation i JOIN FETCH i.sender JOIN FETCH i.receiver"
                + " WHERE " + participant
                + (status != null ? " AND i.status = :status" : "")
                + " ORDER BY i.createdAt DESC";

        var query = em.createQuery(jpql, FriendInvitation.class).setParameter("me", me);
        if (status != null) {
            query.setParameter("status", status);
        }
        return query.getResultStream().map(InvitationDto::from).toList();
    }

    @Transactional
    public InvitationDto findById(TokenUser token, UUID id) {
        return InvitationDto.from(getForParticipant(userService.currentUser(token), id));
    }

    /** The logged-in user invites another user, given by its public uuid. */
    @Transactional
    public InvitationDto create(TokenUser token, UUID receiverId) {
        User me = userService.currentUser(token);
        User receiver = userService.getByUuid(receiverId); // UserNotFoundException -> 404

        if (me.getId().equals(receiver.getId())) {
            throw new InvitationConflictException("You cannot invite yourself");
        }
        checkNoOpenInvitation(me, receiver);

        FriendInvitation invitation = new FriendInvitation();
        invitation.setSender(me);
        invitation.setReceiver(receiver);
        invitation.setStatus(InvitationStatus.PENDING);
        em.persist(invitation);
        try {
            em.flush(); // so the generated uuid and createdAt are set in the response
        } catch (PersistenceException e) {
            // Two requests at the same time can both pass checkNoOpenInvitation;
            // the unique index ux_friend_invitation_pair then rejects the second one.
            if (e instanceof ConstraintViolationException || e.getCause() instanceof ConstraintViolationException) {
                throw new InvitationConflictException("There is already an open invitation between you and " + receiver.getUsername());
            }
            throw e;
        }
        return InvitationDto.from(invitation);
    }

    /** The receiver accepts: both users are now friends. */
    @Transactional
    public InvitationDto accept(TokenUser token, UUID id) {
        return respondAsReceiver(token, id, InvitationStatus.ACCEPTED);
    }

    /** The receiver declines. */
    @Transactional
    public InvitationDto decline(TokenUser token, UUID id) {
        return respondAsReceiver(token, id, InvitationStatus.DECLINED);
    }

    /** The sender withdraws an invitation that was not answered yet. */
    @Transactional
    public InvitationDto cancel(TokenUser token, UUID id) {
        User me = userService.currentUser(token);
        FriendInvitation invitation = getForParticipant(me, id);
        if (!isSender(me, invitation)) {
            throw new InvitationForbiddenException("Only the sender can cancel an invitation");
        }
        return close(invitation, InvitationStatus.CANCELLED);
    }

    private InvitationDto respondAsReceiver(TokenUser token, UUID id, InvitationStatus newStatus) {
        User me = userService.currentUser(token);
        FriendInvitation invitation = getForParticipant(me, id);
        if (isSender(me, invitation)) {
            throw new InvitationForbiddenException("Only the receiver can accept or decline an invitation");
        }
        return close(invitation, newStatus);
    }

    /** Moves a PENDING invitation to its final status. */
    private InvitationDto close(FriendInvitation invitation, InvitationStatus newStatus) {
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new InvitationConflictException("The invitation is already " + invitation.getStatus());
        }
        invitation.setStatus(newStatus);
        invitation.setRespondedAt(OffsetDateTime.now());
        return InvitationDto.from(invitation);
    }

    /** Mirrors ux_friend_invitation_pair: one PENDING or ACCEPTED invitation per pair, in either direction. */
    private void checkNoOpenInvitation(User a, User b) {
        em.createQuery("""
                        SELECT i.status FROM FriendInvitation i
                        WHERE ((i.sender = :a AND i.receiver = :b) OR (i.sender = :b AND i.receiver = :a))
                          AND i.status IN (:open)""", InvitationStatus.class)
                .setParameter("a", a)
                .setParameter("b", b)
                .setParameter("open", List.of(InvitationStatus.PENDING, InvitationStatus.ACCEPTED))
                .getResultStream()
                .findFirst()
                .ifPresent(status -> {
                    throw new InvitationConflictException(status == InvitationStatus.ACCEPTED
                            ? "You are already friends with " + b.getUsername()
                            : "There is already an open invitation between you and " + b.getUsername());
                });
    }

    /** The invitation, if the user is its sender or receiver; otherwise reported as not found. */
    private FriendInvitation getForParticipant(User me, UUID id) {
        FriendInvitation invitation = em.createQuery("""
                        SELECT i FROM FriendInvitation i JOIN FETCH i.sender JOIN FETCH i.receiver
                        WHERE i.uuid = :uuid""", FriendInvitation.class)
                .setParameter("uuid", id)
                .getResultStream()
                .findFirst()
                .orElseThrow(() -> new InvitationNotFoundException(id));
        if (!isSender(me, invitation) && !invitation.getReceiver().getId().equals(me.getId())) {
            throw new InvitationNotFoundException(id);
        }
        return invitation;
    }

    private static boolean isSender(User user, FriendInvitation invitation) {
        return invitation.getSender().getId().equals(user.getId());
    }
}
