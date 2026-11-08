import {Vertex} from "./vertex.js";

export class Area {

    constructor(name, description, vertices = [], color = "#008000", goldPresence = 0, selected = false, uuid = self.crypto.randomUUID()) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.vertices = vertices;
        this.color = color;
        this.private = true;
        this.goldPresence = goldPresence;
        this.selected = selected;
    }

    addVertex(vertex) {
        return new Area(this.name, this.description, [...this.vertices, vertex], this.color, this.goldPresence, this.selected, this.uuid);
    }

    removeVertex(uuid) {
        const vertices = this.vertices.filter(vertex => vertex.uuid !== uuid);
        return new Area(this.name, this.description,  vertices, this.color, this.goldPresence, this.selected, this.uuid);
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
        return new Area(this.name, this.description, vertices, this.color, this.goldPresence, this.selected, this.uuid);
    }

    getPolygon(options = {}) {
        return L.polygon([
            this.vertices.map(vertex => [vertex.lat, vertex.lng])
        ], options);
    }


    static fromJSON(obj) {
        // `coordinates` is the legacy key used before the Coordinates -> Vertex rename;
        // still read it so data already saved in localStorage keeps loading.
        const vertices = (obj.vertices ?? obj.coordinates ?? []).map(Vertex.fromJSON);
        return new Area(obj.name, obj.description, vertices,  obj.color, obj.goldPresence, obj.selected, obj.uuid);
    }

}