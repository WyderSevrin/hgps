import {Vertex} from "./vertex.js";
import {Region} from "./region.js";

export class Area {

    constructor(name, description, vertices = [], goldPresence = 0, selected = false, uuid = self.crypto.randomUUID(), region = null) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.vertices = vertices;
        this.private = true;
        this.goldPresence = Area.normalizeGoldPresence(goldPresence);
        this.selected = selected;
        this.region = Region.normalizeCode(region); // canton code (BE, LU, ...), null = not set yet
    }

    static GOLD_PRESENCE_MIN = 0; // 0 = not determined yet
    static GOLD_PRESENCE_MAX = 5;

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

    // Copy of this area with some fields changed; everything else (uuid, region, ...) is kept.
    #copy({vertices = this.vertices, goldPresence = this.goldPresence, region = this.region} = {}) {
        return new Area(this.name, this.description, vertices, goldPresence, this.selected, this.uuid, region);
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


    static fromJSON(obj) {
        // `coordinates` is the legacy key used before the Coordinates -> Vertex rename;
        // still read it so data already saved in localStorage keeps loading.
        // A legacy `color` field is simply ignored: the color now comes from goldPresence.
        // `region` is missing in data saved before regions existed -> null.
        const vertices = (obj.vertices ?? obj.coordinates ?? []).map(Vertex.fromJSON);
        return new Area(obj.name, obj.description, vertices, obj.goldPresence, obj.selected, obj.uuid, obj.region);
    }

}
