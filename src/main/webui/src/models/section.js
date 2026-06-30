import {Coordinates} from "./coordinates.js";

export class Section {

    constructor(name, coordinates = [], selected = false, uuid = self.crypto.randomUUID()) {
        this.uuid = uuid;
        this.name = name;
        this.coordinates = coordinates;
        this.selected = selected;
    }

    addCoordinate(coordinate) {
        return new Section(this.name, [...this.coordinates, coordinate], this.selected, this.uuid);
    }

    removeCoordinate(uuid) {
        const coordinates = this.coordinates.filter(coordinate => coordinate.uuid !== uuid);
        return new Section(this.name, coordinates, this.selected, this.uuid);
    }

    updateCoordinateIndexes(){
        this.coordinates.forEach((coordinate, index) => coordinate.index = index);
    }

    updateCoordinate(uuid, lat, lng) {
        const coordinates = this.coordinates.map(coordinate => {
            if (coordinate.uuid !== uuid) return coordinate;
            const updated = new Coordinates(coordinate.index, lat, lng);
            updated.uuid = coordinate.uuid;
            return updated;
        });
        return new Section(this.name, coordinates, this.selected, this.uuid);
    }

    getPolygon(options = {}) {
        return L.polygon([
            this.coordinates.map(coordinate => [coordinate.lat, coordinate.lng])
        ], options);
    }


    static fromJSON(obj) {
        const coordinates = (obj.coordinates ?? []).map(Coordinates.fromJSON);
        return new Section(obj.name, coordinates, obj.selected, obj.uuid);
    }

}