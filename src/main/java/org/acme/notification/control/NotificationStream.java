package org.acme.notification.control;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.quarkus.runtime.StartupEvent;
import io.vertx.core.Vertx;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.enterprise.event.TransactionPhase;
import jakarta.ws.rs.sse.OutboundSseEvent;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import lombok.RequiredArgsConstructor;
import org.jboss.logging.Logger;

import java.time.Duration;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Live notifications: keeps the open Server-Sent Events connections of each user
 * (GET /api/notifications/stream) and tells the recipient about every new or removed notification.
 * <p>
 * Events sent on a connection:
 * <pre>
 * event: notification            a new notification
 * data: {NotificationDto as JSON}
 *
 * event: notification-removed    a notification deleted by the system (e.g. friend request withdrawn)
 * data: {"id": "..."}
 * </pre>
 * plus a comment line as heartbeat, so proxies and load balancers do not close an idle connection.
 * <p>
 * The connections are kept in memory, so an event only reaches users connected to the
 * same instance. Running several instances needs a shared channel instead (e.g. PostgreSQL
 * LISTEN/NOTIFY or a message broker) feeding {@link #push(Long, String, Object)}.
 */
@ApplicationScoped
@RequiredArgsConstructor
public class NotificationStream {

    private static final Logger LOG = Logger.getLogger(NotificationStream.class);

    /** Below the usual 60 s idle timeout of load balancers (AWS ALB, Azure App Gateway). */
    private static final Duration HEARTBEAT_INTERVAL = Duration.ofSeconds(25);
    private static final String CREATED_EVENT = "notification";
    private static final String REMOVED_EVENT = "notification-removed";

    /** An open connection, with the Sse that builds its events. */
    private record Connection(SseEventSink sink, Sse sse) {
    }

    private final ObjectMapper objectMapper;
    private final Vertx vertx;

    /** Open connections per user (internal User.id); a user may have several tabs open. */
    private final Map<Long, Set<Connection>> connections = new ConcurrentHashMap<>();

    void startHeartbeat(@Observes StartupEvent event) {
        vertx.setPeriodic(HEARTBEAT_INTERVAL.toMillis(), timerId -> sendHeartbeat());
    }

    /** Registers a new connection of the user and confirms it right away (sends the response headers). */
    public void connect(Long userId, SseEventSink sink, Sse sse) {
        Connection connection = new Connection(sink, sse);
        connections.computeIfAbsent(userId, id -> ConcurrentHashMap.newKeySet()).add(connection);
        send(userId, connection, sse.newEventBuilder().comment("connected").build());
    }

    /** Pushes a notification once the transaction that created it has committed. */
    void onNotificationCreated(@Observes(during = TransactionPhase.AFTER_SUCCESS) NotificationCreated created) {
        push(created.recipientId(), CREATED_EVENT, created.notification());
    }

    /** Tells the recipient a notification is gone, once the transaction that deleted it has committed. */
    void onNotificationRemoved(@Observes(during = TransactionPhase.AFTER_SUCCESS) NotificationRemoved removed) {
        push(removed.recipientId(), REMOVED_EVENT, Map.of("id", removed.notificationId()));
    }

    /** Sends the payload as JSON to all open connections of the user. */
    private void push(Long userId, String eventName, Object payload) {
        Set<Connection> userConnections = connections.get(userId);
        if (userConnections == null) {
            return; // not connected, the list is loaded fresh on the next visit
        }
        String json = toJson(payload);
        for (Connection connection : userConnections) {
            OutboundSseEvent event = connection.sse().newEventBuilder()
                    .name(eventName)
                    .data(json)
                    .build();
            send(userId, connection, event);
        }
    }

    private void sendHeartbeat() {
        connections.forEach((userId, userConnections) -> userConnections.forEach(connection ->
                send(userId, connection, connection.sse().newEventBuilder().comment("heartbeat").build())));
    }

    /** Sends an event, forgetting the connection if the browser has gone away. */
    private void send(Long userId, Connection connection, OutboundSseEvent event) {
        if (connection.sink().isClosed()) {
            disconnect(userId, connection);
            return;
        }
        connection.sink().send(event).whenComplete((ignored, error) -> {
            if (error != null) {
                LOG.debugf("Notification stream of user %d closed: %s", userId, error.getMessage());
                disconnect(userId, connection);
            }
        });
    }

    private void disconnect(Long userId, Connection connection) {
        connections.computeIfPresent(userId, (id, userConnections) -> {
            userConnections.remove(connection);
            return userConnections.isEmpty() ? null : userConnections;
        });
        if (!connection.sink().isClosed()) {
            connection.sink().close();
        }
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Notification could not be serialized", e);
        }
    }
}
