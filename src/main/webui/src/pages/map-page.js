import {css, html, LitElement} from 'lit';
import '../components/map/leaflet-map.js';
import '../components/drawer/drawerComponent.js';
import {Section} from "../models/section.js";


export class MapPage extends LitElement {
    static styles = css`
        :host {
            display: flex;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
        }

        .map-container {
            display: flex;
            flex-direction: row;
            height: 100%;
            width: 100%;
            border: 1px solid #ccc;
            box-sizing: border-box;
        }

        .flex-vertical { /* the wrapper around map-nav + leaflet-map */
            display: flex;
            flex-direction: column;
            flex: 1; /* take all available width */
            min-width: 0; /* allow shrinking below content size */
            min-height: 0;
        }

        .map-nav {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            gap: 5px;
        }

        leaflet-map {
            flex: 1; /* fill remaining height under the nav */
            width: 100%; /* was 75vw  */
            min-height: 0;
            border: 1px solid #ccc;
        }

        custom-button {
            width: 100px;
        }

        /* The drawer is a flex sibling of the map; it slides open via its width. */

        drawer-component {
            width: 0;
            overflow: hidden;
            transition: width 0.3s ease;
        }

        drawer-component.open {
            width: 20%;
        }


        /* Custom Drawer css */

        .drawer-content {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .drawer-section-detail {
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-height: 50px;
            background-color: #504f4f;
        }

        .drawer-section-detail > * {
            display: flex;
            flex-direction: row;
        }

        .drawer-actions {
            display: flex;
            flex-direction: row;
            gap: 5px;
        }
    `;

    static properties = {
        isEditMode: {type: Boolean, state: true},
    };

    constructor() {
        super();
        this.isEditMode = false;
        this.newSection = new Section("new Section");
    }

    changeMode = () => {
        this.isEditMode = !this.isEditMode;
    }

    render() {
        return html`
            <div class="map-container flex-horizontal">
                <div class="flex-vertical">
                    <div class="map-nav">
                        <custom-button icon="visibility"></custom-button>
                        <custom-button .active="${this.isEditMode}" icon="brush"
                                       @click="${() => this.changeMode()}"></custom-button>
                    </div>
                    <leaflet-map .editMode="${this.isEditMode}" .clickEvent="${this.mapAddCoordinate}"></leaflet-map>
                </div>

                <drawer-component
                        class="${this.isEditMode ? 'open' : ''}"
                        .open="${this.isEditMode}"
                        @drawer-close="${() => this.isEditMode = false}">
                    <div slot="content">
                        <h3>Create new Sections</h3>
                        <hr>
                        <div class="drawer-content">
                            <div class="drawer-section-detail">
                                ${this.renderNewSectionCoords()}
                            </div>
                            <div class="drawer-actions">
                                <custom-button icon="add"></custom-button>
                                <custom-button icon="remove"></custom-button>
                            </div>
                        </div>
                    </div>
                </drawer-component>
            </div>
        `;
    }

    renderNewSectionCoords = () => {
        return this.newSection.coordinates.map(coordinate => {
            return html`
                <div>${coordinate.lat}, ${coordinate.lng}</div>`;
        });
    }

    mapAddCoordinate = (lat, lng) => {
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        this.newSection.addCoordinate({lat, lng});

        // todo : add coordonate point to map


        this.requestUpdate();
    }

    //TODO : save section in local storage

    //TODO : load sections from local storage

}

customElements.define('map-page', MapPage);
