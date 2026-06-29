export class Coordinates {

    constructor(index, lat, lng) {
        this.uuid = self.crypto.randomUUID();
        this.index = index;
        this.lat = lat;
        this.lng = lng;
    }

}