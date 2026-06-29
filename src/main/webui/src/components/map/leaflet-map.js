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

            .coordinate-marker {
                display: flex;
                align-items: center;
                justify-content: center;
                background: #2563eb;
                color: #fff;
                border: 2px solid #fff;
                border-radius: 50%;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
            }
        `];
    }

    static properties = {
        editMode: {type: Boolean},
        clickEvent: {type: Function},
        updateSelectedSection: {type: Function},
        sections: {type: Array},
        selectedSection: {type: Object}
    };


    constructor() {
        super();
        this.map = null;
        this.selectedSection = null;
        this.coordinateLayer = null;
    }

    firstUpdated() {
        const mapEl = this.shadowRoot.querySelector('#mapid');
        this.map = L.map(mapEl).setView([46.94809, 7.44744], 13);

        let urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.map.addLayer(L.tileLayer(urlTemplate, {maxZoom: 19}));

        const marker = L.marker([46.94809, 7.44744]).addTo(this.map);
        marker.bindPopup("Bern").openPopup();

        this.coordinateLayer = L.layerGroup().addTo(this.map);

        this.addEvents();
        this.drawCoordinates();
    }

    updated(changedProperties) {
        // Redraw the section's points whenever the selected section changes,
        // or when toggling edit mode (which controls marker draggability).
        if (changedProperties.has('selectedSection') || changedProperties.has('editMode')) {
            this.drawCoordinates();
        }
    }

    // Clear and redraw every coordinate of the selected section.
    drawCoordinates() {
        if (!this.coordinateLayer) return;

        this.coordinateLayer.clearLayers();

        const coordinates = this.selectedSection?.coordinates ?? [];

        // Draw the polygon first so markers sit on top of it.
        let polygon = null;
        if (coordinates.length) {
            polygon = this.selectedSection.getPolygon();
            polygon.addTo(this.coordinateLayer);
        }

        coordinates.forEach((coordinate, index) => {
            const marker = L.marker([coordinate.lat, coordinate.lng], {
                draggable: !!this.editMode,
                icon: this.createIndexIcon(coordinate.index)
            }).addTo(this.coordinateLayer);

            // Live-update the polygon shape while the point is being dragged.
            marker.on('drag', (event) => {
                const {lat, lng} = event.latlng;
                if (polygon) {
                    const latlngs = coordinates.map(c =>
                        c.uuid === coordinate.uuid ? [lat, lng] : [c.lat, c.lng]
                    );
                    polygon.setLatLngs([latlngs]);
                }
            });

            // Commit the moved point to the section state on drop. The parent
            // owns the section and pushes the change back down, redrawing.
            marker.on('dragend', (event) => {
                const {lat, lng} = event.target.getLatLng();
                this.updateSelectedSection?.(coordinate.uuid, lat, lng);
            });
        });
    }

    // Build a marker icon that shows the coordinate's index.
    createIndexIcon(index) {
        return L.divIcon({
            className: 'coordinate-marker',
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
                // Notify the parent; it owns the section and will push new
                // coordinates back down through the `coordinates` property.
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