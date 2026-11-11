package org.acme.invitation.boundary;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import lombok.RequiredArgsConstructor;
import org.acme.invitation.control.InvitationDirection;
import org.acme.invitation.control.InvitationService;
import org.acme.invitation.control.dto.InvitationDto;
import org.acme.invitation.entity.InvitationStatus;
import org.acme.user.control.TokenUser;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.UUID;

/**
 * REST API for the friend invitations of the logged-in user: /api/invitations
 * Requires a valid Keycloak bearer token. Errors are mapped in ExceptionMappers.
 * <pre>
 * GET  /invitations?direction=incoming|outgoing&amp;status=pending   list (both filters optional)
 * GET  /invitations/{id}                                          one invitation
 * POST /invitations/to/{userId}                                   invite a user
 * POST /invitations/{id}/accept                                   receiver accepts
 * POST /invitations/{id}/decline                                  receiver declines
 * POST /invitations/{id}/cancel                                   sender withdraws
 * </pre>
 */
@Path("/invitations")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
@RequiredArgsConstructor
public class InvitationResource {

    private final JsonWebToken jwt;
    private final InvitationService invitationService;

    @GET
    public List<InvitationDto> list(@QueryParam("direction") InvitationDirection direction,
                                    @QueryParam("status") InvitationStatus status) {
        return invitationService.findForUser(me(), direction, status);
    }

    @GET
    @Path("/{id}")
    public InvitationDto get(@PathParam("id") UUID id) {
        return invitationService.findById(me(), id);
    }

    @POST
    @Path("/to/{userId}")
    public Response create(@PathParam("userId") UUID receiverId, UriInfo uriInfo) {
        InvitationDto invitation = invitationService.create(me(), receiverId);
        // Location is /api/invitations/{id}, not relative to the /to/{userId} request path
        return Response.created(uriInfo.getBaseUriBuilder()
                        .path(InvitationResource.class)
                        .path(invitation.getId().toString())
                        .build())
                .entity(invitation)
                .build();
    }

    @POST
    @Path("/{id}/accept")
    public InvitationDto accept(@PathParam("id") UUID id) {
        return invitationService.accept(me(), id);
    }

    @POST
    @Path("/{id}/decline")
    public InvitationDto decline(@PathParam("id") UUID id) {
        return invitationService.decline(me(), id);
    }

    @POST
    @Path("/{id}/cancel")
    public InvitationDto cancel(@PathParam("id") UUID id) {
        return invitationService.cancel(me(), id);
    }

    private TokenUser me() {
        return TokenUser.from(jwt);
    }
}
