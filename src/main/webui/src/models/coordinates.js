export class Coordinates {

    constructor(index, lat, lng) {
        this.uuid = self.crypto.randomUUID();
        this.index = index;
        this.lat = lat;
        this.lng = lng;
    }


    static fromJSON(obj) {
        const coordinate = new Coordinates(obj.index, obj.lat, obj.lng);
        coordinate.uuid = obj.uuid;
        return coordinate;
    }

}