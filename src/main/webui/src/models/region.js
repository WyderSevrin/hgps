import {getLanguage} from "../services/i18n/i18n.js";

/**
 * A Swiss region (canton), mirrors the `region` table (see V3__create_region.sql).
 * `code` is the two-letter canton abbreviation (BE, LU, ...) and is what an Area stores.
 */
export class Region {

    constructor(code, names = {}) {
        this.code = code;
        this.names = names; // {de, fr, it, en}
    }

    // The name in the current UI language, falling back to English, then to the code.
    get label() {
        return this.names[getLanguage()] ?? this.names.en ?? this.code;
    }

    // Accepts both the frontend shape ({code, names}) and the table shape ({code, nameDe, ...}).
    static fromJSON(obj) {
        const names = obj.names ?? {de: obj.nameDe, fr: obj.nameFr, it: obj.nameIt, en: obj.nameEn};
        return new Region(obj.code, names);
    }

    // Region code as stored on an area: upper case two letters, or null when not set.
    static normalizeCode(value) {
        if (typeof value !== "string") return null;
        const code = value.trim().toUpperCase();
        return /^[A-Z]{2}$/.test(code) ? code : null;
    }

}
