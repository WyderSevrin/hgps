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
import org.acme.user.control.UserAlreadyExistsException;
import org.acme.user.control.UserNotFoundException;
import org.acme.user.control.UserService;
import org.acme.user.control.dto.UserRequestDto;
import org.acme.user.control.dto.UserResponseDto;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST API for users: /api/users
 * No permission checks yet.
 */
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class UserResource {

    private final UserService userService;

    @GET
    public List<UserResponseDto> list() {
        return userService.findAll();
    }

    @GET
    @Path("/{id}")
    public UserResponseDto get(@PathParam("id") UUID id) {
        return userService.findById(id);
    }

    @POST
    public Response create(@Valid @NotNull UserRequestDto request, UriInfo uriInfo) {
        UserResponseDto user = userService.create(request);
        return Response.created(uriInfo.getAbsolutePathBuilder().path(user.getId().toString()).build())
                .entity(user)
                .build();
    }

    @PUT
    @Path("/{id}")
    public UserResponseDto update(@PathParam("id") UUID id, @Valid @NotNull UserRequestDto request) {
        return userService.update(id, request);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") UUID id) {
        userService.delete(id);
        return Response.noContent().build();
    }

    @ServerExceptionMapper
    public Response mapNotFound(UserNotFoundException e) {
        return error(Response.Status.NOT_FOUND, e.getMessage());
    }

    @ServerExceptionMapper
    public Response mapAlreadyExists(UserAlreadyExistsException e) {
        return error(Response.Status.CONFLICT, e.getMessage());
    }

    private static Response error(Response.Status status, String message) {
        return Response.status(status).entity(Map.of("message", message)).type(MediaType.APPLICATION_JSON).build();
    }
}
