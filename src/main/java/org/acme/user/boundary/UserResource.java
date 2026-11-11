package org.acme.user.boundary;

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
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import lombok.RequiredArgsConstructor;
import org.acme.user.control.UserService;
import org.acme.user.control.dto.UserCreateDto;
import org.acme.user.control.dto.UserDto;

import java.util.List;
import java.util.UUID;

/**
 * REST API for users: /api/users
 * No permission checks yet. Errors are mapped in ExceptionMappers.
 */
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class UserResource {

    private final UserService userService;

    @GET
    public List<UserDto> list() {
        return userService.findAll();
    }

    @GET
    @Path("/{id}")
    public UserDto get(@PathParam("id") UUID id) {
        return userService.findById(id);
    }

    @POST
    public Response create(@Valid @NotNull UserCreateDto request, UriInfo uriInfo) {
        UserDto user = userService.create(request);
        return Response.created(uriInfo.getAbsolutePathBuilder().path(user.getId().toString()).build())
                .entity(user)
                .build();
    }

    @PUT
    @Path("/{id}")
    public UserDto update(@PathParam("id") UUID id, @Valid @NotNull UserCreateDto request) {
        return userService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") UUID id) {
        userService.delete(id);
        return Response.noContent().build();
    }

}
