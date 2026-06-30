import {Section} from "./section.js";

export class MapData {

    constructor(sections=[], points=[]) {
        this.sections = sections;
        this.points = points;
    }

    static fromJSON(obj) {
        if (!obj) return null;
        const sections = (obj.sections ?? []).map(Section.fromJSON);
        return new MapData(sections, obj.points ?? []);
    }

}