export class Section {

    constructor(name) {
        this.name = name;
        this.coordinates = [];
    }

    addCoordinate(coordinate){
        this.coordinates.push(coordinate);
    }

}