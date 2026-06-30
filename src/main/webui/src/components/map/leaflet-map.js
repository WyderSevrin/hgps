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
        data: {type: Object},
        editMode: {type: Boolean},
        clickEvent: {type: Function},
        updateSelectedSection: {type: Function},
        selectSection: {type: Function},
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

        //Bern
        L.marker([46.94809, 7.44744]).addTo(this.map);

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

        //Draw the selected section
        this.drawSection(this.selectedSection);

        //Draw the other sections (compare by uuid: editing the selected
        //section replaces it with a new instance, so reference checks fail).
        this.data.sections.forEach(section => {
            if (section?.uuid !== this.selectedSection?.uuid && section?.coordinates?.length > 0) {
                this.drawSection(section);
            }
        });
    }


    drawSection = section => {
        const coordinates = section?.coordinates ?? [];

        // Draw the polygon first so markers sit on top of it. The selected
        // section keeps Leaflet's default blue; other sections are coloured.
        let polygon = null;
        if (coordinates.length) {
            const color = section?.selected === true ? '#3388ff' : '#9333ea';
            polygon = section.getPolygon({color});
            polygon.addTo(this.coordinateLayer);

            // Log the section's info when its polygon is clicked.
            polygon.on('click', (event) => {
                if (!this.editMode) return;

                // Stop the click from bubbling to the map, which would
                // otherwise add a new coordinate in edit mode.
                L.DomEvent.stopPropagation(event);

                // Switching only allowed while the current section is empty.
                // Otherwise we keep editing it and just log.
                if (this.selectedSection?.coordinates?.length > 0) {
                    return;
                }

                this.selectSection?.(section);
            });
        }

        coordinates.forEach((coordinate) => {
            const marker = L.marker([coordinate.lat, coordinate.lng], {
                draggable: !!this.editMode && section?.selected === true,
                icon: this.createIndexIcon(coordinate.index)
            }).addTo(this.coordinateLayer);

            if(section?.selected === true) {

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
            }
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