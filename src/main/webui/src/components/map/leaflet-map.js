import {LitElement, html} from 'lit';
import { leafletMapStyles } from './leaflet-map.styles.js';
import L from 'leaflet'; // Importer Leaflet
import 'leaflet/dist/leaflet.css'; // Importer les styles pour que Leaflet fonctionne correctement
import { MAP_MAX_ZOOM } from '../../map-styles/index.js';
import { getMapStyle, onMapStyleChange } from '../../services/mapStyle/mapStyle.js';


export class LeafletMap extends LitElement {
    static styles = leafletMapStyles;

    static properties = {
        data: {type: Object},
        editMode: {type: Boolean},
        clickEvent: {type: Function},
        updateSelectedArea: {type: Function},
        selectArea: {type: Function},
        selectedArea: {type: Object},
        // Gold presence levels to show; null/undefined = show every area.
        visibleGoldPresence: {type: Array},
    };


    constructor() {
        super();
        this.map = null;
        this.tileLayer = null;
        this.selectedArea = null;
        this.vertexLayer = null;
        this.resizeObserver = null;
    }

    firstUpdated() {
        const mapEl = this.shadowRoot.querySelector('#mapid');
        this.map = L.map(mapEl, {maxZoom: MAP_MAX_ZOOM}).setView([46.94809, 7.44744], 13);
        this.showMapStyle(getMapStyle());

        //Bern
        L.marker([46.94809, 7.44744]).addTo(this.map);

        this.vertexLayer = L.layerGroup().addTo(this.map);

        // Keep the map in sync with its container size. Leaflet caches the
        // container dimensions, so when the available width changes (sidebar
        // collapsing, drawer opening, window resizing) it must be told to
        // recompute — otherwise tiles render grey/offset. The observer fires
        // on every frame of the CSS width transition, keeping it seamless.
        this.resizeObserver = new ResizeObserver(() => this.map?.invalidateSize());
        this.resizeObserver.observe(mapEl);

        this.addEvents();
        this.drawVertices();
    }

    connectedCallback() {
        super.connectedCallback();
        // Follow the map style chosen in User options > Map
        this.unsubscribeMapStyle = onMapStyleChange(style => this.showMapStyle(style));
    }

    disconnectedCallback() {
        this.unsubscribeMapStyle?.();
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        super.disconnectedCallback();
    }

    // Replace the background tiles with the given map style (see map-styles/index.js).
    showMapStyle(style) {
        if (!this.map) return; // not created yet: firstUpdated shows the current style
        this.tileLayer?.remove();
        this.tileLayer = L.tileLayer(style.url, {
            maxNativeZoom: style.maxNativeZoom,
            maxZoom: MAP_MAX_ZOOM,
            attribution: style.attribution,
        }).addTo(this.map);
    }

    updated(changedProperties) {
        // Redraw whenever the selected area changes, edit mode toggles
        // (which controls marker draggability), or the underlying data set
        // changes (e.g. an area was added or deleted).
        if (changedProperties.has('selectedArea')
            || changedProperties.has('editMode')
            || changedProperties.has('data')
            || changedProperties.has('visibleGoldPresence')) {
            this.drawVertices();
        }
    }

    // Resolve a theme token (defined in style.css :root) to a concrete color.
    // Leaflet needs a plain color string, so var(...) can't be used directly.
    _themeColor(token, fallback) {
        return getComputedStyle(this).getPropertyValue(token).trim() || fallback;
    }

    // Clear and redraw every vertex of the selected area.
    drawVertices() {
        if (!this.vertexLayer) return;

        this.vertexLayer.clearLayers();

        //Draw the selected area (always, even if the filter hides its level,
        //so the area being edited never disappears)
        this.drawArea(this.selectedArea);

        const visible = this.visibleGoldPresence ? new Set(this.visibleGoldPresence) : null;

        //Draw the other areas (compare by uuid: editing the selected
        //area replaces it with a new instance, so reference checks fail).
        this.data.areas.forEach(area => {
            if (area?.uuid !== this.selectedArea?.uuid
                && area?.vertices?.length > 0
                && (!visible || visible.has(area.goldPresence))) {
                this.drawArea(area);
            }
        });
    }


    drawArea = area => {
        const vertices = area?.vertices ?? [];


        let polygon = null;
        if (vertices.length) {
            // Color comes from the gold presence; the selected area keeps its
            // color (so the slider previews it live) and gets a bolder outline.
            const color = this._themeColor(area.colorVar, '#7d8a91');
            const selected = area?.selected === true;
            polygon = area.getPolygon({
                color,
                weight: selected ? 4 : 2,
                fillOpacity: selected ? 0.4 : 0.25,
            });
            polygon.addTo(this.vertexLayer);


            //Click event on Area
            polygon.on('click', (event) => {
                if(this.editMode){
                    L.DomEvent.stopPropagation(event);
                    this.selectArea?.(area);
                }
            });
        }

        vertices.forEach((vertex) => {
            const marker = L.marker([vertex.lat, vertex.lng], {
                draggable: !!this.editMode && area?.selected === true,
                icon: this.createIndexIcon(vertex.index)
            }).addTo(this.vertexLayer);

            if(area?.selected === true) {
                //Start drag event
                marker.on('drag', (event) => {
                    const {lat, lng} = event.latlng;
                    if (polygon) {
                        const latlngs = vertices.map(c =>
                            c.uuid === vertex.uuid ? [lat, lng] : [c.lat, c.lng]
                        );
                        polygon.setLatLngs([latlngs]);
                    }
                });

                //End drag event
                marker.on('dragend', (event) => {
                    const {lat, lng} = event.target.getLatLng();
                    this.updateSelectedArea?.(vertex.uuid, lat, lng);
                });
            }
        });
    }

    // Build a marker icon that shows the vertex's index.
    createIndexIcon(index) {
        return L.divIcon({
            className: 'vertex-marker',
            html: `<span>${index}</span>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });
    }

    //Events
    addEvents = () => {
        this.map.on('click', (event) => {
            const {lat, lng} = event.latlng;
            if (this.editMode) {
                // Notify the parent; it owns the area and will push new
                // vertices back down through the `vertices` property.
                this.clickEvent(lat, lng);
            }
        });
    }

    render() {
        return html`
            <link rel="stylesheet" href="https://cdn.skypack.dev/leaflet/dist/leaflet.css">
            <div id="mapid" style="height: 100%"></div>
        `;
    }
}

customElements.define('leaflet-map', LeafletMap);