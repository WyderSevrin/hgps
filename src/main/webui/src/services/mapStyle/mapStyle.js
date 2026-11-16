import { MAP_STYLES, DEFAULT_MAP_STYLE_ID } from '../../map-styles/index.js';
import { Preference, PreferenceController } from '../preferences/preference.js';

// Map style service: which tile layer the map shows. The choice is
// remembered in localStorage and saved to the user's settings
// (see preferences/userSettingsSync.js). The map listens to onMapStyleChange.

export { MAP_STYLES };

export const mapStylePreference = new Preference({
    storageKey: 'mapStyle',
    options: MAP_STYLES,
    defaultId: DEFAULT_MAP_STYLE_ID,
});

export const getMapStyle = () => mapStylePreference.current;

export const setMapStyle = id => mapStylePreference.set(id);

/**
 * Calls listener(style) after every map style change. Returns a function
 * that removes the listener.
 */
export const onMapStyleChange = listener => mapStylePreference.onChange(listener);

/** Lit reactive controller: re-renders its host whenever the map style changes. */
export class MapStyleController extends PreferenceController {
    constructor(host) {
        super(host, mapStylePreference);
    }
}

// Area shown in the style previews: Bern and the Aare.
const PREVIEW = {lat: 46.948, lng: 7.447, zoom: 12};

/** URL of the single tile used as the preview of a style in User options > Map. */
export function previewTileUrl(style) {
    // Standard "slippy map" tile numbering (Web Mercator)
    const n = 2 ** PREVIEW.zoom;
    const latRad = PREVIEW.lat * Math.PI / 180;
    const x = Math.floor((PREVIEW.lng + 180) / 360 * n);
    const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
    return style.url
        .replace('{s}', 'a')
        .replace('{z}', PREVIEW.zoom)
        .replace('{x}', x)
        .replace('{y}', y);
}
