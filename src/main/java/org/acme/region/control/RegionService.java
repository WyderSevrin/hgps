package org.acme.region.control;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.acme.region.control.dto.RegionDto;
import org.acme.region.entity.Region;

import java.util.List;

/**
 * Read access to the regions (cantons).
 */
@ApplicationScoped
@RequiredArgsConstructor
public class RegionService {

    private final EntityManager em;

    public List<RegionDto> findAll() {
        return em.createQuery("SELECT r FROM Region r ORDER BY r.code", Region.class)
                .getResultStream()
                .map(RegionDto::from)
                .toList();
    }

    /** The region with this code, for other services; null code means "no region". */
    public Region getByCode(String code) {
        if (code == null) {
            return null;
        }
        Region region = em.find(Region.class, code);
        if (region == null) {
            throw new UnknownRegionException(code);
        }
        return region;
    }
}
