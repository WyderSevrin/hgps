import {Vertex} from "./vertex.js";

export class Area {

    constructor(name, description, vertices = [], goldPresence = 0, selected = false, uuid = self.crypto.randomUUID()) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.vertices = vertices;
        this.private = true;
        this.goldPresence = Area.normalizeGoldPresence(goldPresence);
        this.selected = selected;
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

    addVertex(vertex) {
        return new Area(this.name, this.description, [...this.vertices, vertex], this.goldPresence, this.selected, this.uuid);
    }

    removeVertex(uuid) {
        const vertices = this.vertices.filter(vertex => vertex.uuid !== uuid);
        return new Area(this.name, this.description, vertices, this.goldPresence, this.selected, this.uuid);
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
        return new Area(this.name, this.description, vertices, this.goldPresence, this.selected, this.uuid);
    }

    withGoldPresence(goldPresence) {
        return new Area(this.name, this.description, this.vertices, goldPresence, this.selected, this.uuid);
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
        const vertices = (obj.vertices ?? obj.coordinates ?? []).map(Vertex.fromJSON);
        return new Area(obj.name, obj.description, vertices, obj.goldPresence, obj.selected, obj.uuid);
    }

}
