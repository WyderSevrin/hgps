import {Vertex} from "./vertex.js";
import {Region} from "./region.js";

export class Area {

    constructor(name, description, vertices = [], goldPresence = 0, selected = false, uuid = self.crypto.randomUUID(), region = null) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.vertices = vertices;
        this.isPrivate = true; // true: only the owner sees it; false: friends too (everyone if the profile is public)
        this.goldPresence = Area.normalizeGoldPresence(goldPresence);
        this.selected = selected;
        this.region = Region.normalizeCode(region); // canton code (BE, LU, ...), null = not set yet

        // Set by the backend (see AreaService), null while the area is not saved yet
        this.owner = null; // {id, username, displayName}
        this.createdAt = null;
        this.updatedAt = null;
    }

    static GOLD_PRESENCE_MIN = 0; // 0 = not determined yet
    static GOLD_PRESENCE_MAX = 5;
    static MIN_VERTICES = 3; // a polygon needs at least 3 corners (same rule as the backend)

    // Always store an integer between 0 and 5, also for older saved data
    // (where it could be a string like "0", or missing).
    static normalizeGoldPresence(value) {
        const n = Math.round(Number(value));
        if (Number.isNaN(n)) return Area.GOLD_PRESENCE_MIN;
        return Math.min(Area.GOLD_PRESENCE_MAX, Math.max(Area.GOLD_PRESENCE_MIN, n));
    }

    // Name of the theme color token (defined in style.css) for a gold presence level.
    static goldPresenceColorVar(level) {
        return `--hgps-gold-level-${Area.normalizeGoldPresence(level)}`;
    }

    // The area's color is derived from its gold presence.
    get colorVar() {
        return Area.goldPresenceColorVar(this.goldPresence);
    }

    // True once the area exists in the backend: saving it again is an update, not a creation.
    get isSaved() {
        return this.createdAt !== null;
    }

    // True for the given user's areas, and for a new area (no owner until it is saved).
    // The backend checks it again: only the owner can update or delete an area.
    isOwnedBy(userId) {
        return this.owner === null || this.owner.id === userId;
    }

    // Copy of this area with some fields changed; everything else (uuid, region, owner, ...) is kept.
    #copy({
              name = this.name,
              description = this.description,
              vertices = this.vertices,
              goldPresence = this.goldPresence,
              region = this.region,
              selected = this.selected,
              isPrivate = this.isPrivate,
          } = {}) {
        const copy = new Area(name, description, vertices, goldPresence, selected, this.uuid, region);
        copy.isPrivate = isPrivate;
        copy.owner = this.owner;
        copy.createdAt = this.createdAt;
        copy.updatedAt = this.updatedAt;
        return copy;
    }

    addVertex(vertex) {
        return this.#copy({vertices: [...this.vertices, vertex]});
    }

    removeVertex(uuid) {
        return this.#copy({vertices: this.vertices.filter(vertex => vertex.uuid !== uuid)});
    }

    updateVertexIndexes(){
        this.vertices.forEach((vertex, index) => vertex.index = index);
    }

    updateVertex(uuid, lat, lng) {
        const vertices = this.vertices.map(vertex => {
            if (vertex.uuid !== uuid) return vertex;
            const updated = new Vertex(vertex.index, lat, lng);
            updated.uuid = vertex.uuid;
            return updated;
        });
        return this.#copy({vertices});
    }

    withSelected(selected) {
        return this.#copy({selected});
    }

    withName(name) {
        return this.#copy({name});
    }

    withDescription(description) {
        return this.#copy({description});
    }

    withPrivacy(isPrivate) {
        return this.#copy({isPrivate});
    }

    withGoldPresence(goldPresence) {
        return this.#copy({goldPresence});
    }

    // region: a canton code ("BE") or a Region instance, null to clear it.
    withRegion(region) {
        return this.#copy({region: region instanceof Region ? region.code : region});
    }

    getPolygon(options = {}) {
        return L.polygon([
            this.vertices.map(vertex => [vertex.lat, vertex.lng])
        ], options);
    }

}
