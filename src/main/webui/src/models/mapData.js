/**
 * What the map shows (loaded from the backend, see AreaService):
 *  - areas:       the logged-in user's own areas, editable;
 *  - sharedAreas: public areas of other users (friends, public profiles), read only;
 *  - points:      not used yet.
 */
export class MapData {

    constructor(areas = [], sharedAreas = [], points = []) {
        this.areas = areas;
        this.sharedAreas = sharedAreas;
        this.points = points;
    }

}
