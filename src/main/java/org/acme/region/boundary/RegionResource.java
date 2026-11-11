package org.acme.region.boundary;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import lombok.RequiredArgsConstructor;
import org.acme.region.control.RegionService;
import org.acme.region.control.dto.RegionDto;

import java.util.List;

/**
 * REST API for the regions (Swiss cantons): /api/regions
 * Public reference data, no login needed.
 */
@Path("/regions")
@Produces(MediaType.APPLICATION_JSON)
@RequiredArgsConstructor
public class RegionResource {

    private final RegionService regionService;

    @GET
    public List<RegionDto> list() {
        return regionService.findAll();
    }
}
