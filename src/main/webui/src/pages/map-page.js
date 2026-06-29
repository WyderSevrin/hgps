import {css, html, LitElement} from 'lit';
import '../components/map/leaflet-map.js';
import '../components/drawer/drawerComponent.js';
import {Section} from "../models/section.js";
import {LeafletMap} from "../components/map/leaflet-map.js";
import {Coordinates} from "../models/coordinates.js";


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
        this.sections = [];
        this.selectedSection = new Section("new Section", []);

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
                    <leaflet-map id="map" .editMode="${this.isEditMode}"
                                 .clickEvent="${this.mapAddCoordinate}"
                                 .updateSelectedSection="${this.mapMoveCoordinate}"
                                 .selectedSection="${this.selectedSection}"></leaflet-map>
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
                                ${this.renderCurrentSectionCoords()}
                            </div>
                            <div class="drawer-actions">
                                <custom-button icon="add" @click="${() => this._createSection()}"></custom-button>
                                <custom-button icon="remove"></custom-button>
                            </div>
                        </div>
                    </div>
                </drawer-component>
            </div>
        `;
    }

    renderCurrentSectionCoords = () => {
        return this.selectedSection.coordinates.map(coordinate => {
            return html`
                <div> ${coordinate.index} -->  ${coordinate.lat}, ${coordinate.lng}
                    <custom-button icon="remove"  @click="${() => this._removePoint(coordinate.uuid)}"></custom-button>
                </div>`;
        });
    }

    mapAddCoordinate = (lat, lng) => {
        this.selectedSection = this.selectedSection.addCoordinate(new Coordinates(this.selectedSection.coordinates.length, lat, lng));
        this.requestUpdate();
    }

    mapMoveCoordinate = (uuid, lat, lng) => {
        this.selectedSection = this.selectedSection.updateCoordinate(uuid, lat, lng);
        this.requestUpdate();
    }

    _createSection = () => {
        this.sections.push(this.selectedSection);
        this.selectedSection = new Section("new Section");
    }

    _removePoint = uuid => {
        this.selectedSection = this.selectedSection.removeCoordinate(uuid);
        this.selectedSection.updateCoordinateIndexes();
        this.requestUpdate();
    }


    //------------------------------------------------------------------------------------------------------------------
    // TODO's for this page

    //TODO : save section in local storage
        //todo : remove the 2 button +/- and add save disk and reset


    //TODO : load sections from local storage

    //TODO : creating a section should also have a custom color to it, for the points and section

    //TODO : a section should have a name and be removable

    //TODO : rename the coordinates of a section to something more accurate (point -> vertex)

    //TODO : clicking on the edge of a section should create a new point

    //TODO : changing to another section when the previous section has been modified should give a warning ? a pop-up ?

}

customElements.define('map-page', MapPage);
