import {Coordinates} from "./coordinates.js";

export class Section {

    constructor(name, coordinates = [], uuid = self.crypto.randomUUID(), selected = false) {
        this.uuid = uuid;
        this.name = name;
        this.coordinates = coordinates;
        this.selected = selected;
    }

    // Return a NEW Section (same uuid) so Lit detects the change by identity.
    addCoordinate(coordinate) {
        return new Section(this.name, [...this.coordinates, coordinate], this.uuid, this.selected);
    }

    removeCoordinate(uuid) {
        const coordinates = this.coordinates.filter(coordinate => coordinate.uuid !== uuid);
        return new Section(this.name, coordinates, this.uuid, this.selected);
    }

    updateCoordinateIndexes(){
        this.coordinates.forEach((coordinate, index) => coordinate.index = index);
    }

    // Move an existing coordinate (preserving its uuid) and return a NEW Section.
    updateCoordinate(uuid, lat, lng) {
        const coordinates = this.coordinates.map(coordinate => {
            if (coordinate.uuid !== uuid) return coordinate;
            const updated = new Coordinates(coordinate.index, lat, lng);
            updated.uuid = coordinate.uuid;
            return updated;
        });
        return new Section(this.name, coordinates, this.uuid, this.selected);
    }

    getPolygon() {
        return L.polygon([
            this.coordinates.map(coordinate => [coordinate.lat, coordinate.lng])
        ]);
    }

}