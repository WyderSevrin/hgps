package org.acme.notification.boundary;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.sse.Sse;
import jakarta.ws.rs.sse.SseEventSink;
import lombok.RequiredArgsConstructor;
import org.acme.notification.control.NotificationService;
import org.acme.notification.control.NotificationStream;
import org.acme.notification.control.dto.NotificationDto;
import org.acme.user.control.TokenUser;
import org.acme.user.control.UserService;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.UUID;

/**
 * REST API for the notifications of the logged-in user: /api/notifications
 * Requires a valid Keycloak bearer token. Errors are mapped in ExceptionMappers.
 * <pre>
 * GET    /notifications          list, newest first
 * GET    /notifications/stream   Server-Sent Events: each new notification, live (see NotificationStream)
 * POST   /notifications/read     mark all as read
 * DELETE /notifications/{id}     clear one notification
 * DELETE /notifications          clear all notifications
 * </pre>
 */
@Path("/notifications")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
@RequiredArgsConstructor
public class NotificationResource {

    private final JsonWebToken jwt;
    private final NotificationService notificationService;
    private final NotificationStream notificationStream;
    private final UserService userService;

    @GET
    public List<NotificationDto> list() {
        return notificationService.findForUser(me());
    }

    /** Stays open: the connection is kept by NotificationStream until the browser closes it. */
    @GET
    @Path("/stream")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void stream(@Context SseEventSink sink, @Context Sse sse) {
        notificationStream.connect(userService.currentUser(me()).getId(), sink, sse);
    }

    @POST
    @Path("/read")
    public Response markAllRead() {
        notificationService.markAllRead(me());
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") UUID id) {
        notificationService.delete(me(), id);
        return Response.noContent().build();
    }

    @DELETE
    public Response deleteAll() {
        notificationService.deleteAll(me());
        return Response.noContent().build();
    }

    private TokenUser me() {
        return TokenUser.from(jwt);
    }
}
