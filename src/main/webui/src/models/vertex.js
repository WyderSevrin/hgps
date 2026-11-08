export class Vertex {

    constructor(index, lat, lng) {
        this.uuid = self.crypto.randomUUID();
        this.index = index;
        this.lat = lat;
        this.lng = lng;
    }


    static fromJSON(obj) {
        const vertex = new Vertex(obj.index, obj.lat, obj.lng);
        vertex.uuid = obj.uuid;
        return vertex;
    }

}