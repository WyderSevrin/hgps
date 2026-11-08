import {LitElement, html, css} from 'lit';
import L from 'leaflet'; // Importer Leaflet
import 'leaflet/dist/leaflet.css'; // Importer les styles pour que Leaflet fonctionne correctement


export class LeafletMap extends LitElement {
    static get styles() {
        return [css`
            :host {
                display: block;
                height: 200px;
            }

            .vertex-marker {
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--hgps-map-marker);
                color: var(--hgps-text-strong);
                border: 2px solid var(--hgps-text-strong);
                border-radius: 50%;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 1px 4px var(--hgps-shadow-soft);
            }
        `];
    }

    static properties = {
        data: {type: Object},
        editMode: {type: Boolean},
        clickEvent: {type: Function},
        updateSelectedArea: {type: Function},
        selectArea: {type: Function},
        selectedArea: {type: Object}
    };


    constructor() {
        super();
        this.map = null;
        this.selectedArea = null;
        this.vertexLayer = null;
        this.resizeObserver = null;
    }

    firstUpdated() {
        const mapEl = this.shadowRoot.querySelector('#mapid');
        this.map = L.map(mapEl).setView([46.94809, 7.44744], 13);

        let urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.map.addLayer(L.tileLayer(urlTemplate, {maxZoom: 19}));

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

    disconnectedCallback() {
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        super.disconnectedCallback();
    }

    updated(changedProperties) {
        // Redraw whenever the selected area changes, edit mode toggles
        // (which controls marker draggability), or the underlying data set
        // changes (e.g. an area was added or deleted).
        if (changedProperties.has('selectedArea')
            || changedProperties.has('editMode')
            || changedProperties.has('data')) {
            this.drawVertices();
        }
    }

    // Resolve a theme token (defined in style.css :root) to a concrete color.
    // Leaflet needs a plain color string, so var(...) can't be used directly.
    _themeColor(selectedColor, fallback) {
        return selectedColor || fallback;
    }

    // Clear and redraw every vertex of the selected area.
    drawVertices() {
        if (!this.vertexLayer) return;

        this.vertexLayer.clearLayers();

        //Draw the selected area
        this.drawArea(this.selectedArea);

        //Draw the other areas (compare by uuid: editing the selected
        //area replaces it with a new instance, so reference checks fail).
        this.data.areas.forEach(area => {
            if (area?.uuid !== this.selectedArea?.uuid && area?.vertices?.length > 0) {
                this.drawArea(area);
            }
        });
    }


    drawArea = area => {
        const vertices = area?.vertices ?? [];


        let polygon = null;
        if (vertices.length) {
            const color = area?.selected === true
                ? this._themeColor(getComputedStyle(this).getPropertyValue('--hgps-map-poly-active').trim(), '#f2c94c')
                : this._themeColor(area.color, '#9333ea');
            polygon = area.getPolygon({color});
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