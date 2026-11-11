package org.acme.healthcheck.boundary;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/healthcheck")
public class HealthCheck {

    @GET
    public Response get() {
        return Response.ok().build();
    }
}
