package org.acme.area.control;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.acme.area.control.dto.AreaCreateDto;
import org.acme.area.control.dto.AreaDto;
import org.acme.area.control.dto.VertexDto;
import org.acme.area.entity.Area;
import org.acme.invitation.control.Friendship;
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
 * Visibility: a user sees
 * <ul>
 *     <li>their own areas, private or public,</li>
 *     <li>the public areas of their friends,</li>
 *     <li>the public areas of users with a public profile (User.publicProfile), friends or not.</li>
 * </ul>
 * Areas a user may not see are reported as not found. Only the owner can change or delete an area.
 * <p>
 * All methods are transactional because resolving the logged-in user may create it (first login).
 */
@ApplicationScoped
@RequiredArgsConstructor
public class AreaService {

    /** Loads everything AreaDto needs in one query (no lazy loading per area). */
    private static final String SELECT_WITH_DETAILS = "SELECT a FROM Area a"
            + " JOIN FETCH a.owner LEFT JOIN FETCH a.region LEFT JOIN FETCH a.vertices";

    /**
     * The visibility rule (see the class comment) as a JPQL condition on the area "a".
     * Parameter :me (the logged-in user), set by {@link #visibleQuery}.
     */
    private static final String VISIBLE_TO_ME = " (a.owner = :me"
            + " OR (a.isPrivate = false AND (a.owner.publicProfile = true"
            + " OR " + Friendship.areFriends(":me", "a.owner") + ")))";

    private final EntityManager em;
    private final UserService userService;
    private final RegionService regionService;

    /**
     * The areas visible to the logged-in user, newest first.
     *
     * @param ownerIds only the areas of these users (public uuids), or empty for all owners
     * @param region   only the areas in this canton, or null for all regions
     */
    @Transactional
    public List<AreaDto> findVisible(TokenUser token, List<UUID> ownerIds, String region) {
        User me = userService.currentUser(token);
        boolean filterOwners = !ownerIds.isEmpty();

        String jpql = SELECT_WITH_DETAILS
                + " WHERE" + VISIBLE_TO_ME
                + (filterOwners ? " AND a.owner.uuid IN :ownerIds" : "")
                + (region != null ? " AND a.region.code = :region" : "")
                + " ORDER BY a.createdAt DESC";

        var query = visibleQuery(jpql, me);
        if (filterOwners) {
            query.setParameter("ownerIds", ownerIds);
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

    /** The area, if the user may see it (see the class comment). */
    private Area getVisible(User me, UUID id) {
        return visibleQuery(SELECT_WITH_DETAILS + " WHERE a.uuid = :uuid AND" + VISIBLE_TO_ME, me)
                .setParameter("uuid", id)
                .getResultStream()
                .findFirst()
                .orElseThrow(() -> new AreaNotFoundException(id));
    }

    /** A query whose condition contains {@link #VISIBLE_TO_ME}, with its parameter set. */
    private TypedQuery<Area> visibleQuery(String jpql, User me) {
        return em.createQuery(jpql, Area.class).setParameter("me", me);
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
