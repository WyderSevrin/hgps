import {css, html, LitElement} from 'lit';
import '../components/map/leaflet-map.js';
import '../components/drawer/drawerComponent.js';
import '../components/dialog/confirmDialogComponent.js';
import {Section} from "../models/section.js";
import {Coordinates} from "../models/coordinates.js";
import {LocalStorageService} from "../services/localStorage/localStorageService.js";
import {MapData} from "../models/mapData.js";


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

        .map-nav custom-button {
            width: 100px;
        }

        /* The drawer is a flex sibling of the map; it slides open via its width. */

        drawer-component {
            width: 0;
            overflow: hidden;
            transition: width 0.3s ease;
        }

        drawer-component.open {
            width: max(22%, 280px);
        }


        /* Custom Drawer css */

        .drawer-content {
            height: 100%;
            box-sizing: border-box;
            padding: 16px;
            color: #e8e8e8;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        }

        .drawer-title {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 0 12px;
            font-size: 1.05rem;
            font-weight: 600;
            letter-spacing: 0.2px;
            color: #ffffff;
        }

        .drawer-title custom-icon {
            color: #ff9800;
        }

        .drawer-content-body {
            display: flex;
            flex-direction: column;
            gap: 16px;
            height: calc(100% - 40px);
        }

        /* Card wrapper for each logical block of the drawer */

        .card {
            display: flex;
            flex-direction: column;
            background-color: #2b2b2b;
            border: 1px solid #3d3d3d;
            border-radius: 10px;
            overflow: hidden;
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 10px 12px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #b9b9b9;
            background-color: #333333;
            border-bottom: 1px solid #3d3d3d;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 22px;
            height: 20px;
            padding: 0 6px;
            border-radius: 999px;
            background-color: #ff9800;
            color: #1a1a1a;
            font-size: 0.72rem;
            font-weight: 700;
        }

        /* Labeled form field (e.g. section name) inside a card */

        .field {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 12px;
            border-bottom: 1px solid #3d3d3d;
        }

        .field-label {
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #9a9a9a;
        }

        .text-input {
            width: 100%;
            box-sizing: border-box;
            padding: 9px 10px;
            background-color: #1f1f1f;
            border: 1px solid #454545;
            border-radius: 6px;
            color: #f0f0f0;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .text-input::placeholder {
            color: #6f6f6f;
        }

        .text-input:focus {
            border-color: #ff9800;
            box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.25);
        }

        /* Scrollable list of rows inside a card */

        .row-list {
            display: flex;
            flex-direction: column;
            max-height: 240px;
            overflow-y: auto;
        }

        .row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 12px;
            border-bottom: 1px solid #363636;
        }

        .row:last-child {
            border-bottom: none;
        }

        .row:hover {
            background-color: #343434;
        }

        .row-index {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 24px;
            height: 24px;
            border-radius: 6px;
            background-color: #454545;
            color: #ff9800;
            font-size: 0.78rem;
            font-weight: 700;
            flex-shrink: 0;
        }

        .row-main {
            display: flex;
            flex-direction: column;
            gap: 2px;
            flex: 1;
            min-width: 0;
        }

        .row-title {
            font-size: 0.85rem;
            font-weight: 600;
            color: #f0f0f0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .row-sub {
            font-size: 0.72rem;
            color: #9a9a9a;
            font-variant-numeric: tabular-nums;
        }

        .row-actions {
            display: flex;
            gap: 4px;
            flex-shrink: 0;
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 20px 12px;
            text-align: center;
            color: #8a8a8a;
            font-size: 0.8rem;
        }

        .empty-state custom-icon {
            color: #5a5a5a;
        }

        .drawer-actions {
            display: flex;
            flex-direction: row;
            gap: 8px;
            padding: 12px;
            border-top: 1px solid #3d3d3d;
            background-color: #262626;
        }

        .drawer-actions custom-button {
            flex: 1;
        }

        /* Compact icon-only buttons used inside rows */

        .icon-btn {
            width: 36px;
        }
    `;

    static properties = {
        isEditMode: {type: Boolean, state: true},
        sectionToDelete: {type: Object, state: true},
    };

    constructor() {
        super();
        this.isEditMode = false;
        this.sectionToDelete = null;
        this.selectedSection = new Section("new Section", [], true);
        this.mapData = LocalStorageService.getMapData() ?? new MapData();
    }

    reLoad(){
        console.log("reloading")
        this.mapData = LocalStorageService.getMapData() ?? new MapData();
        this.requestUpdate();
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
                    <leaflet-map id="map" 
                                 .data="${this.mapData}"
                                 .editMode="${this.isEditMode}"
                                 .clickEvent="${this.mapAddCoordinate}"
                                 .updateSelectedSection="${this.mapMoveCoordinate}"
                                 .selectSection="${this.mapSelectSection}"
                                 .selectedSection="${this.selectedSection}"></leaflet-map>
                </div>

                <drawer-component
                        class="${this.isEditMode ? 'open' : ''}"
                        .open="${this.isEditMode}"
                        @drawer-close="${() => this._closeDrawer()}">
                    <div class="drawer-content" slot="content">
                        <h3 class="drawer-title">
                            <custom-icon label="edit_location_alt"></custom-icon>
                            Section editor
                        </h3>
                        <div class="drawer-content-body">
                            <div class="card">
                                <div class="card-header">
                                    <span>Current section</span>
                                    <span class="badge">${this.selectedSection.coordinates.length}</span>
                                </div>
                                <div class="field">
                                    <label class="field-label" for="section-name">Name</label>
                                    <input id="section-name" type="text" class="text-input"
                                           placeholder="Section name"
                                           .value="${this.selectedSection.name}"
                                           @input="${this._updateSectionName}">
                                </div>
                                <div class="row-list">
                                    ${this.renderCurrentSectionCoords()}
                                </div>
                                <div class="drawer-actions">
                                    <custom-button label="Save" icon="save" .active="${true}"
                                                   @click="${() => this._createSection()}"></custom-button>
                                    <custom-button label="Reset" icon="restart_alt"
                                                   @click="${() => this._resetCurrentSection()}"></custom-button>
                                </div>
                            </div>

                            <div class="card">
                                <div class="card-header">
                                    <span>Saved sections</span>
                                    <span class="badge">${this.mapData.sections.length}</span>
                                </div>
                                <div class="row-list">
                                    ${this.renderSections()}
                                </div>
                            </div>
                        </div>
                    </div>
                </drawer-component>

                <confirm-dialog
                        .open="${this.sectionToDelete !== null}"
                        title="Delete section"
                        message="${this.sectionToDelete
                                ? `Delete “${this.sectionToDelete.name}”? This action cannot be undone.`
                                : ''}"
                        confirmLabel="Delete"
                        cancelLabel="Cancel"
                        @confirm="${() => this._confirmRemoveSection()}"
                        @cancel="${() => this._cancelRemoveSection()}">
                </confirm-dialog>
            </div>
        `;
    }

    renderCurrentSectionCoords = () => {
        if (this.selectedSection.coordinates.length === 0) {
            return html`
                <div class="empty-state">
                    <custom-icon label="add_location_alt"></custom-icon>
                    <span>Click on the map to add points.</span>
                </div>`;
        }

        return this.selectedSection.coordinates.map(coordinate => {
            return html`
                <div class="row">
                    <span class="row-index">${coordinate.index + 1}</span>
                    <div class="row-main">
                        <span class="row-title">Point ${coordinate.index + 1}</span>
                        <span class="row-sub">${coordinate.lat.toFixed(5)}, ${coordinate.lng.toFixed(5)}</span>
                    </div>
                    <div class="row-actions">
                        <custom-button class="icon-btn" icon="remove"
                                       @click="${() => this._removePoint(coordinate.uuid)}"></custom-button>
                    </div>
                </div>`;
        });
    }

    renderSections = () => {
        if (this.mapData.sections.length === 0) {
            return html`
                <div class="empty-state">
                    <custom-icon label="layers_clear"></custom-icon>
                    <span>No saved sections yet.</span>
                </div>`;
        }

        return this.mapData.sections.map(section => {
            return html`
                <div class="row">
                    <custom-icon label="hexagon"></custom-icon>
                    <div class="row-main">
                        <span class="row-title">${section.name}</span>
                        <span class="row-sub">${section.coordinates.length} points</span>
                    </div>
                    <div class="row-actions">
                        <custom-button class="icon-btn" icon="edit"
                                       @click="${() => this._editSection(section)}"></custom-button>
                        <custom-button class="icon-btn" icon="delete"
                                       @click="${() => this._requestRemoveSection(section)}"></custom-button>
                    </div>
                </div>`;
        })
    }

    mapAddCoordinate = (lat, lng) => {
        this.selectedSection = this.selectedSection.addCoordinate(new Coordinates(this.selectedSection.coordinates.length, lat, lng));
        this.reLoad();
    }


    mapSelectSection = (section) => {
        section.selected = true;
        this.selectedSection.selected = false;
        this.selectedSection = section;
        this.reLoad();
    }

    mapMoveCoordinate = (uuid, lat, lng) => {
        this.selectedSection = this.selectedSection.updateCoordinate(uuid, lat, lng);
        this.reLoad();
    }

    _removePoint = uuid => {
        this.selectedSection = this.selectedSection.removeCoordinate(uuid);
        this.selectedSection.updateCoordinateIndexes();
        this.reLoad();
    }

    _updateSectionName = e => {
        this.selectedSection.name = e.target.value;
    }

    _editSection = section => {
        this.mapSelectSection(section);
    }

    // Open the confirmation dialog for the given section.
    _requestRemoveSection = section => {
        this.sectionToDelete = section;
    }

    _confirmRemoveSection = () => {
        if (this.sectionToDelete) {
            this._removeSection(this.sectionToDelete.uuid);
        }
        this.sectionToDelete = null;
    }

    _cancelRemoveSection = () => {
        this.sectionToDelete = null;
    }

    _removeSection = uuid => {
        this.mapData.sections = this.mapData.sections.filter(sec => sec.uuid !== uuid);
        LocalStorageService.saveMapData(this.mapData);

        // If the section being edited is the one deleted, drop it from the
        // editor so it also disappears from the map right away.
        if (this.selectedSection?.uuid === uuid) {
            this.selectedSection.selected = false;
            this.selectedSection = new Section("new Section", [], true);
        }

        this.reLoad();
    }

    _createSection = () => {
        this.selectedSection.selected = false;
        const alreadyExsits = this.mapData.sections.filter(sec => sec.uuid === this.selectedSection.uuid).length > 0

        if(alreadyExsits){
             const index = this.mapData.sections.findIndex(sec => sec.uuid === this.selectedSection.uuid)
            this.mapData.sections[index] = this.selectedSection
        }else{
            this.mapData.sections.push(this.selectedSection);
        }

        this.selectedSection = new Section("new Section", [], true);

        LocalStorageService.saveMapData(this.mapData);
        this.reLoad();
    }

    _resetCurrentSection = () => {
        this.selectedSection = new Section("new Section", [], true);
        this.reLoad();
    }

    _closeDrawer = () => {
        this.selectedSection.selected = false;
        this.selectedSection = new Section("new Section", [], true);
        this.isEditMode = false
    }

    //------------------------------------------------------------------------------------------------------------------
    // TODO's for this page

    //TODO : show in drawer all sections
        //TODO : make the drawer have something like 2 parts, this should be an Optional paramether
        //TODO : make it possible that a section can be deleted

    //TODO : a section should have a name and a custom color (maybe a color picker)

    //TODO : rename the coordinates of a section to something more accurate (point -> vertex)

    //TODO : clicking on the edge of a section should create a new point

    //TODO : changing to another section when the previous section has been modified should give a warning ? a pop-up ?
        //TODO : if a new section is created but not saved and the drawer is closed a pop up should appear to warn the user

}

customElements.define('map-page', MapPage);
