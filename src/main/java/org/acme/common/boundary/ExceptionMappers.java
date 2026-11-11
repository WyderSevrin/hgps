package org.acme.common.boundary;

import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.area.control.AreaForbiddenException;
import org.acme.area.control.AreaNotFoundException;
import org.acme.invitation.control.InvitationConflictException;
import org.acme.invitation.control.InvitationForbiddenException;
import org.acme.invitation.control.InvitationNotFoundException;
import org.acme.region.control.UnknownRegionException;
import org.acme.user.control.UserAlreadyExistsException;
import org.acme.user.control.UserNotFoundException;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import java.util.Map;

/**
 * Turns the business exceptions of the control layer into HTTP responses, for all resources.
 * <p>
 * Methods annotated with {@link ServerExceptionMapper} in a class that is not a resource are
 * global, so the resources stay free of error handling and the services free of HTTP.
 * Every error body has the same shape: {@code {"message": "..."}}.
 */
public class ExceptionMappers {

    // ---- 400 Bad Request ----

    @ServerExceptionMapper
    public Response mapUnknownRegion(UnknownRegionException e) {
        return error(Response.Status.BAD_REQUEST, e);
    }

    // ---- 404 Not Found ----

    @ServerExceptionMapper
    public Response mapUserNotFound(UserNotFoundException e) {
        return error(Response.Status.NOT_FOUND, e);
    }

    @ServerExceptionMapper
    public Response mapInvitationNotFound(InvitationNotFoundException e) {
        return error(Response.Status.NOT_FOUND, e);
    }

    @ServerExceptionMapper
    public Response mapAreaNotFound(AreaNotFoundException e) {
        return error(Response.Status.NOT_FOUND, e);
    }

    // ---- 409 Conflict ----

    @ServerExceptionMapper
    public Response mapUserAlreadyExists(UserAlreadyExistsException e) {
        return error(Response.Status.CONFLICT, e);
    }

    @ServerExceptionMapper
    public Response mapInvitationConflict(InvitationConflictException e) {
        return error(Response.Status.CONFLICT, e);
    }

    // ---- 403 Forbidden ----

    @ServerExceptionMapper
    public Response mapInvitationForbidden(InvitationForbiddenException e) {
        return error(Response.Status.FORBIDDEN, e);
    }

    @ServerExceptionMapper
    public Response mapAreaForbidden(AreaForbiddenException e) {
        return error(Response.Status.FORBIDDEN, e);
    }

    private static Response error(Response.Status status, Exception e) {
        return Response.status(status)
                .entity(Map.of("message", e.getMessage()))
                .type(MediaType.APPLICATION_JSON)
                .build();
    }
}
