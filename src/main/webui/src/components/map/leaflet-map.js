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
        `];
    }

    static properties = {
        editMode: {type: Boolean},
        clickEvent: {type: Function}
    };


    constructor() {
        super();
        this.map = null;
    }

    firstUpdated() {
        const mapEl = this.shadowRoot.querySelector('#mapid');
        this.map = L.map(mapEl).setView([46.94809, 7.44744], 13);

        let urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        this.map.addLayer(L.tileLayer(urlTemplate, {maxZoom: 19}));

        const marker = L.marker([46.94809, 7.44744]).addTo(this.map);
        marker.bindPopup("Bern").openPopup();


        this.addEvents();

    }

    //Events
    addEvents = () => {
        this.map.on('click', (event) => {
            const {lat, lng} = event.latlng;
            if (this.editMode) {

                // console.log(`Latitude: ${lat}, Longitude: ${lng}`);
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