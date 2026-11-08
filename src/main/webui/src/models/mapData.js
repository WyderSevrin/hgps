import {Area} from "./area.js";

export class MapData {

    constructor(areas=[], points=[]) {
        this.areas = areas;
        this.points = points;
    }

    static fromJSON(obj) {
        if (!obj) return null;
        // `sections` is the legacy key used before the Section -> Area rename;
        // still read it so data already saved in localStorage keeps loading.
        const areas = (obj.areas ?? obj.sections ?? []).map(Area.fromJSON);
        return new MapData(areas, obj.points ?? []);
    }

}