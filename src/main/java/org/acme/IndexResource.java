package org.acme;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/")
public class IndexResource {

    @GET
    public Response get() {
        return Response.ok().build();
    }

}


