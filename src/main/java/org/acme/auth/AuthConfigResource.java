package org.acme.auth;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Public endpoint telling the frontend where Keycloak is: /api/auth/config
 * Keeps the Keycloak location in application.properties instead of the JS bundle.
 */
@Path("/auth/config")
@Produces(MediaType.APPLICATION_JSON)
public class AuthConfigResource {

    public record AuthConfig(String url, String realm, String clientId) {
    }

    @ConfigProperty(name = "hgps.auth.url")
    String url;

    @ConfigProperty(name = "hgps.auth.realm")
    String realm;

    @ConfigProperty(name = "hgps.auth.client-id")
    String clientId;

    @GET
    public AuthConfig get() {
        return new AuthConfig(url, realm, clientId);
    }
}
