package org.acme.user.boundary;

import io.quarkus.security.Authenticated;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import org.acme.user.control.TokenUser;
import org.acme.user.control.UserService;
import org.acme.user.control.dto.UserDto;
import org.eclipse.microprofile.jwt.JsonWebToken;

/**
 * The logged-in user: /api/me
 * Requires a valid Keycloak bearer token. On the first call for a Keycloak
 * account, the matching application user is created (or linked by e-mail).
 */
@Path("/me")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
@RequiredArgsConstructor
public class MeResource {

    private final JsonWebToken jwt;
    private final UserService userService;

    @GET
    public UserDto me() {
        return userService.findOrCreateFromToken(TokenUser.from(jwt));
    }
}
