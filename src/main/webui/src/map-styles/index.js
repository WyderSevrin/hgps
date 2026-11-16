// Registry of the map styles (the tile layers the map can show).
//
// Adding a style:
//   1. Add an entry to MAP_STYLES (the order is the order shown in
//      User options > Map):
//        id             saved in the user settings: lower-case letters, digits, '-'
//        url            Leaflet tile URL template
//        maxNativeZoom  highest zoom the server has tiles for; above it,
//                       Leaflet scales up the last level (see MAP_MAX_ZOOM)
//        attribution    credit required by the tile provider (HTML)
//   2. Add its name and description to the i18n files under
//      userOptions.map.styles.<id>.{name,description}.
// Before adding a provider, check its usage policy (API key, traffic limits).

const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const MAP_STYLES = [
    {
        id: 'standard',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        maxNativeZoom: 19,
        attribution: OSM_ATTRIBUTION,
    },
    {
        id: 'topographic',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        maxNativeZoom: 17,
        attribution: `${OSM_ATTRIBUTION}, SRTM | Style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> `
            + '(<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    },
];

export const DEFAULT_MAP_STYLE_ID = 'standard';

/** Highest zoom of the map, whatever the style. */
export const MAP_MAX_ZOOM = 19;
