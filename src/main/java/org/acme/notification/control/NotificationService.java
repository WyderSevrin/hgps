package org.acme.notification.control;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Event;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.acme.notification.control.dto.NotificationDto;
import org.acme.notification.entity.Notification;
import org.acme.notification.entity.NotificationType;
import org.acme.user.control.TokenUser;
import org.acme.user.control.UserService;
import org.acme.user.entity.User;

import java.util.List;
import java.util.UUID;

/**
 * Business logic and persistence for notifications.
 * <p>
 * Other services create notifications with {@link #notify(User, User, NotificationType)}, inside
 * their own transaction: the notification is stored with their change, and pushed live
 * ({@link NotificationStream}) only once that transaction has committed.
 * <p>
 * The other methods act on behalf of the logged-in user (the token), who only ever sees
 * their own notifications.
 */
@ApplicationScoped
@RequiredArgsConstructor
public class NotificationService {

    private final EntityManager em;
    private final UserService userService;
    private final Event<NotificationCreated> createdEvent;
    private final Event<NotificationRemoved> removedEvent;

    /** Stores a new unread notification for the recipient and schedules its live push. */
    @Transactional
    public void notify(User recipient, User actor, NotificationType type) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setType(type);
        em.persist(notification);
        em.flush(); // so the generated uuid and createdAt are in the pushed notification

        createdEvent.fire(new NotificationCreated(recipient.getId(), NotificationDto.from(notification)));
    }

    /**
     * Deletes the "sender sent you a friend request" notifications of the receiver,
     * when the sender withdraws the request, and removes them live from the receiver's list.
     */
    @Transactional
    public void removeFriendRequest(User receiver, User sender) {
        List<Notification> requests = em.createQuery("""
                        SELECT n FROM Notification n
                        WHERE n.recipient = :receiver AND n.actor = :sender AND n.type = :type""", Notification.class)
                .setParameter("receiver", receiver)
                .setParameter("sender", sender)
                .setParameter("type", NotificationType.FRIEND_REQUEST)
                .getResultList();
        for (Notification request : requests) {
            em.remove(request);
            removedEvent.fire(new NotificationRemoved(receiver.getId(), request.getUuid()));
        }
    }

    /** The notifications of the logged-in user, newest first. */
    @Transactional
    public List<NotificationDto> findForUser(TokenUser token) {
        return em.createQuery("""
                        SELECT n FROM Notification n LEFT JOIN FETCH n.actor
                        WHERE n.recipient = :me
                        ORDER BY n.createdAt DESC""", Notification.class)
                .setParameter("me", userService.currentUser(token))
                .getResultStream()
                .map(NotificationDto::from)
                .toList();
    }

    /** Marks all notifications of the logged-in user as read. */
    @Transactional
    public void markAllRead(TokenUser token) {
        em.createQuery("UPDATE Notification n SET n.read = true WHERE n.recipient = :me AND n.read = false")
                .setParameter("me", userService.currentUser(token))
                .executeUpdate();
    }

    /** Deletes one notification of the logged-in user. */
    @Transactional
    public void delete(TokenUser token, UUID id) {
        int deleted = em.createQuery("DELETE FROM Notification n WHERE n.uuid = :uuid AND n.recipient = :me")
                .setParameter("uuid", id)
                .setParameter("me", userService.currentUser(token))
                .executeUpdate();
        if (deleted == 0) {
            throw new NotificationNotFoundException(id);
        }
    }

    /** Deletes all notifications of the logged-in user. */
    @Transactional
    public void deleteAll(TokenUser token) {
        em.createQuery("DELETE FROM Notification n WHERE n.recipient = :me")
                .setParameter("me", userService.currentUser(token))
                .executeUpdate();
    }
}
