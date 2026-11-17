import {apiRequest} from "./apiClient.js";
import {Area} from "../../models/area.js";
import {Vertex} from "../../models/vertex.js";
import {auth} from "../auth/authService.js";

/**
 * Areas from the backend (/api/areas), as Area models.
 * Requires a logged-in user. Errors are thrown as ApiError.
 *
 * Visibility (backend rules, see AreaService.java): own areas, public areas of friends
 * and public areas of users with a public profile;
 * only the owner can update or delete an area.
 */
export class AreaService {

    /**
     * @param {object} [filter]
     * @param {string|string[]} [filter.owner]  public id(s) of users: only their areas
     * @param {string} [filter.region] canton code, e.g. 'BE'
     * @returns {Promise<Area[]>} newest first
     */
    static async list({owner, region} = {}) {
        const areas = await apiRequest('GET', '/areas', {query: {owner, region}});
        return areas.map(AreaService.#toArea);
    }

    /**
     * The logged-in user's own areas (private and public), without the public areas of others.
     * @param {object} [filter]
     * @param {string} [filter.region] canton code, e.g. 'BE'
     * @returns {Promise<Area[]>} newest first
     */
    static listMine({region} = {}) {
        return AreaService.list({owner: auth.user.id, region});
    }

    /**
     * The public areas of other users, in one request. The backend only returns
     * the ones the logged-in user may see (friends' areas, public profiles' areas).
     * @param {string[]} userIds  public ids of the users, not the logged-in user's
     * @returns {Promise<Area[]>} newest first; empty when no user is given
     */
    static async listPublicOf(userIds) {
        if (userIds.length === 0) return [];
        const areas = await AreaService.list({owner: userIds});
        return areas.filter(area => !area.isPrivate);
    }

    /** @returns {Promise<Area>} */
    static async get(id) {
        return AreaService.#toArea(await apiRequest('GET', `/areas/${id}`));
    }

    /**
     * Saves a new area. The backend generates the id: the returned Area has the
     * backend's id as uuid, the local uuid of the given area is not kept.
     * @param {Area} area
     * @returns {Promise<Area>}
     */
    static async create(area) {
        return AreaService.#toArea(await apiRequest('POST', '/areas', {body: AreaService.#toRequest(area)}));
    }

    /**
     * Replaces an existing area (all fields, vertices included). Owner only.
     * @param {Area} area  its uuid must be the backend id
     * @returns {Promise<Area>}
     */
    static async update(area) {
        return AreaService.#toArea(await apiRequest('PUT', `/areas/${area.uuid}`, {body: AreaService.#toRequest(area)}));
    }

    /** Deletes an area. Owner only. */
    static async delete(id) {
        await apiRequest('DELETE', `/areas/${id}`);
    }

    /** Area model -> body of POST/PUT (AreaCreateDto). */
    static #toRequest(area) {
        return {
            name: area.name,
            description: area.description,
            goldPresence: area.goldPresence,
            isPrivate: area.isPrivate,
            region: area.region,
            // The backend takes the order of the list as polygon order
            vertices: [...area.vertices]
                .sort((a, b) => a.index - b.index)
                .map(({lat, lng}) => ({lat, lng})),
        };
    }

    /** AreaDto -> Area model. */
    static #toArea(dto) {
        const vertices = dto.vertices.map(v => new Vertex(v.index, v.lat, v.lng)); // new local uuid per vertex
        const area = new Area(dto.name, dto.description ?? "", vertices, dto.goldPresence, false, dto.id, dto.region);
        // Not constructor parameters of Area, so set afterwards (Area's copy methods keep them)
        area.isPrivate = dto.isPrivate;
        area.owner = dto.owner;          // {id, username, displayName}
        area.createdAt = dto.createdAt;
        area.updatedAt = dto.updatedAt;
        return area;
    }
}
