package org.acme.area.control;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.acme.area.control.dto.AreaCreateDto;
import org.acme.area.control.dto.AreaDto;
import org.acme.area.control.dto.VertexDto;
import org.acme.area.entity.Area;
import org.acme.region.control.RegionService;
import org.acme.user.control.TokenUser;
import org.acme.user.control.UserService;
import org.acme.user.entity.User;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * Business logic and persistence for areas.
 * Every method acts on behalf of the logged-in user (the token).
 * <p>
 * Visibility: a user sees their own areas and the public areas of everyone.
 * Private areas of others are reported as not found. Only the owner can change or delete an area.
 * <p>
 * All methods are transactional because resolving the logged-in user may create it (first login).
 */
@ApplicationScoped
@RequiredArgsConstructor
public class AreaService {

    /** Loads everything AreaDto needs in one query (no lazy loading per area). */
    private static final String SELECT_WITH_DETAILS = "SELECT a FROM Area a"
            + " JOIN FETCH a.owner LEFT JOIN FETCH a.region LEFT JOIN FETCH a.vertices";

    private final EntityManager em;
    private final UserService userService;
    private final RegionService regionService;

    /**
     * The areas visible to the logged-in user, newest first.
     *
     * @param ownerId only the areas of this user (public uuid), or null for all owners
     * @param region  only the areas in this canton, or null for all regions
     */
    @Transactional
    public List<AreaDto> findVisible(TokenUser token, UUID ownerId, String region) {
        User me = userService.currentUser(token);

        String jpql = SELECT_WITH_DETAILS
                + " WHERE (a.owner = :me OR a.isPrivate = false)"
                + (ownerId != null ? " AND a.owner.uuid = :ownerId" : "")
                + (region != null ? " AND a.region.code = :region" : "")
                + " ORDER BY a.createdAt DESC";

        var query = em.createQuery(jpql, Area.class).setParameter("me", me);
        if (ownerId != null) {
            query.setParameter("ownerId", ownerId);
        }
        if (region != null) {
            query.setParameter("region", region.trim().toUpperCase(Locale.ROOT));
        }
        return query.getResultStream().map(AreaDto::from).toList();
    }

    @Transactional
    public AreaDto findById(TokenUser token, UUID id) {
        return AreaDto.from(getVisible(userService.currentUser(token), id));
    }

    /** Creates an area owned by the logged-in user. */
    @Transactional
    public AreaDto create(TokenUser token, AreaCreateDto request) {
        Area area = new Area();
        area.setOwner(userService.currentUser(token));
        apply(area, request);
        em.persist(area);
        em.flush(); // so the generated uuid and createdAt are set in the response
        return AreaDto.from(area);
    }

    /** Replaces all the editable fields of an area of the logged-in user, vertices included. */
    @Transactional
    public AreaDto update(TokenUser token, UUID id, AreaCreateDto request) {
        Area area = getOwned(userService.currentUser(token), id);
        apply(area, request);
        em.flush();
        return AreaDto.from(area);
    }

    /** Deletes an area of the logged-in user, with its vertices. */
    @Transactional
    public void delete(TokenUser token, UUID id) {
        em.remove(getOwned(userService.currentUser(token), id));
    }

    private void apply(Area area, AreaCreateDto request) {
        area.setName(request.getName().trim());
        area.setDescription(request.getDescription() == null || request.getDescription().isBlank()
                ? null : request.getDescription().trim());
        area.setGoldPresence(request.getGoldPresence() == null ? Area.GOLD_PRESENCE_MIN : request.getGoldPresence());
        area.setPrivate(request.getIsPrivate() == null || request.getIsPrivate());
        area.setRegion(regionService.getByCode(request.getRegion() == null
                ? null : request.getRegion().toUpperCase(Locale.ROOT))); // UnknownRegionException -> 400
        area.replaceVertices(request.getVertices().stream().map(VertexDto::toEntity).toList());
        area.markUpdated();
    }

    /** The area, if the user may see it: their own, or a public one. */
    private Area getVisible(User me, UUID id) {
        Area area = em.createQuery(SELECT_WITH_DETAILS + " WHERE a.uuid = :uuid", Area.class)
                .setParameter("uuid", id)
                .getResultStream()
                .findFirst()
                .orElseThrow(() -> new AreaNotFoundException(id));
        if (area.isPrivate() && !area.isOwnedBy(me)) {
            throw new AreaNotFoundException(id);
        }
        return area;
    }

    /** The area, if the user owns it. A visible area of someone else gives 403, an invisible one 404. */
    private Area getOwned(User me, UUID id) {
        Area area = getVisible(me, id);
        if (!area.isOwnedBy(me)) {
            throw new AreaForbiddenException(id);
        }
        return area;
    }
}
