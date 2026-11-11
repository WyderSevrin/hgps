package org.acme.area.boundary;

import io.quarkus.security.Authenticated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import lombok.RequiredArgsConstructor;
import org.acme.area.control.AreaService;
import org.acme.area.control.dto.AreaCreateDto;
import org.acme.area.control.dto.AreaDto;
import org.acme.user.control.TokenUser;
import org.eclipse.microprofile.jwt.JsonWebToken;

import java.util.List;
import java.util.UUID;

/**
 * REST API for the areas: /api/areas
 * Requires a valid Keycloak bearer token. Errors are mapped in ExceptionMappers.
 * <pre>
 * GET    /areas?owner={userId}&amp;region=BE   own + public areas (both filters optional)
 * GET    /areas/{id}                         one area (own, or public)
 * POST   /areas                              create, owned by the logged-in user
 * PUT    /areas/{id}                         replace (owner only)
 * DELETE /areas/{id}                         delete (owner only)
 * </pre>
 */
@Path("/areas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
@RequiredArgsConstructor
public class AreaResource {

    private final JsonWebToken jwt;
    private final AreaService areaService;

    @GET
    public List<AreaDto> list(@QueryParam("owner") UUID ownerId,
                              @QueryParam("region") String region) {
        return areaService.findVisible(me(), ownerId, region);
    }

    @GET
    @Path("/{id}")
    public AreaDto get(@PathParam("id") UUID id) {
        return areaService.findById(me(), id);
    }

    @POST
    public Response create(@Valid @NotNull AreaCreateDto request, UriInfo uriInfo) {
        AreaDto area = areaService.create(me(), request);
        return Response.created(uriInfo.getAbsolutePathBuilder().path(area.getId().toString()).build())
                .entity(area)
                .build();
    }

    @PUT
    @Path("/{id}")
    public AreaDto update(@PathParam("id") UUID id, @Valid @NotNull AreaCreateDto request) {
        return areaService.update(me(), id, request);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") UUID id) {
        areaService.delete(me(), id);
        return Response.noContent().build();
    }

    private TokenUser me() {
        return TokenUser.from(jwt);
    }
}
