import {MapData} from "../../models/mapData.js";

export class LocalStorageService {

    static saveMapData(data) {
        localStorage.setItem('mapData', JSON.stringify(data));
    }

    static getMapData() {
        return MapData.fromJSON(JSON.parse(localStorage.getItem('mapData')));
    }

    static clearData() {
        localStorage.clear();
    }

}