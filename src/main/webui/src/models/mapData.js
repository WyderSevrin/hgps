/** What the map shows: the areas (loaded from the backend, see AreaService) and, later, points. */
export class MapData {

    constructor(areas = [], points = []) {
        this.areas = areas;
        this.points = points;
    }

}
