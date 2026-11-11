import {apiRequest} from "./apiClient.js";
import {Area} from "../../models/area.js";
import {Vertex} from "../../models/vertex.js";

/**
 * Areas from the backend (/api/areas), as Area models.
 * Requires a logged-in user. Errors are thrown as ApiError.
 *
 * Visibility (backend rules): own areas + public areas of everyone;
 * only the owner can update or delete an area.
 */
export class AreaService {

    /**
     * @param {object} [filter]
     * @param {string} [filter.owner]  public id of a user: only their areas
     * @param {string} [filter.region] canton code, e.g. 'BE'
     * @returns {Promise<Area[]>} newest first
     */
    static async list({owner, region} = {}) {
        const areas = await apiRequest('GET', '/areas', {query: {owner, region}});
        return areas.map(AreaService.#toArea);
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
            private: area.private,
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
        // Not (yet) constructor parameters of Area, so set afterwards.
        // Note: Area's copy methods (addVertex, withGoldPresence, ...) do not carry them over.
        area.private = dto.private;
        area.owner = dto.owner;          // {id, username, displayName}
        area.createdAt = dto.createdAt;
        area.updatedAt = dto.updatedAt;
        return area;
    }
}
