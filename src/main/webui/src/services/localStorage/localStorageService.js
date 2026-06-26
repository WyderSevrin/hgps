export class LocalStorageService {

    static saveSections(data) {
        localStorage.setItem('sections', JSON.stringify(data));
    }

    static getSections() {
        return JSON.parse(localStorage.getItem('sections'));
    }

    static clearData() {
        localStorage.clear();
    }

}