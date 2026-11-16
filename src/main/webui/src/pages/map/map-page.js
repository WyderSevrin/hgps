import {html, LitElement} from 'lit';
import { fieldLabelStyles } from '../../styles/shared.styles.js';
import { mapPageStyles } from './map-page.styles.js';
import '../../components/map/leaflet-map.js';
import '../../components/drawer/drawerComponent.js';
import '../../components/dialog/confirmDialogComponent.js';
import '../../components/slider/slider-component.js';
import '../../components/top-drawer/top-drawer-component.js';
import {GoldPresenceFilter} from '../../components/filter/gold-presence-filter.js';
import '../../components/collapsible/collapsible-component.js';
import {Area} from "../../models/area.js";
import {Vertex} from "../../models/vertex.js";
import {LocalStorageService} from "../../services/localStorage/localStorageService.js";
import {MapData} from "../../models/mapData.js";
import {I18nController, t} from "../../services/i18n/i18n.js";


export class MapPage extends LitElement {
    static styles = [fieldLabelStyles, mapPageStyles];

    static properties = {
        isEditMode: {type: Boolean, state: true},
        areaToDelete: {type: Object, state: true},
        // Reactive so assigning a new area (e.g. while sliding the gold
        // presence) re-renders the drawer and redraws the map immediately.
        selectedArea: {type: Object, state: true},
        // Gold presence levels whose areas are shown on the map (top drawer filter).
        visibleGoldPresence: {type: Array, state: true},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.isEditMode = false;
        this.areaToDelete = null;
        // 0 = not determined yet; 1..5 = rated gold presence.
        this.defaultGoldPresence = 0;
        this.visibleGoldPresence = [...GoldPresenceFilter.ALL_LEVELS];
        this.selectedArea = new Area(t('map.newSection'), "", [], this.defaultGoldPresence, true);
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
                        <custom-button .active="${this.isEditMode}" icon="brush"
                                       @click="${() => this.changeMode()}"></custom-button>
                    </div>
                    <top-drawer openLabel="${t('mapFilters.open')}"
                                closeLabel="${t('mapFilters.close')}">
                        <div class="top-drawer-content">
                            <!-- Search: UI only for now, not wired to anything yet -->
                            <div class="search">
                                <custom-icon label="search"></custom-icon>
                                <input type="search" class="text-input"
                                       placeholder="${t('mapFilters.searchPlaceholder')}"
                                       aria-label="${t('mapFilters.searchPlaceholder')}">
                            </div>
                            <gold-presence-filter
                                    .levels="${this.visibleGoldPresence}"
                                    @filter-change="${e => this.visibleGoldPresence = e.detail.levels}">
                            </gold-presence-filter>
                        </div>
                    </top-drawer>
                    <leaflet-map id="map"
                                 .data="${this.mapData}"
                                 .visibleGoldPresence="${this.visibleGoldPresence}"
                                 .editMode="${this.isEditMode}"
                                 .clickEvent="${this.mapAddVertex}"
                                 .updateSelectedArea="${this.mapMoveVertex}"
                                 .selectArea="${this.mapSelectArea}"
                                 .selectedArea="${this.selectedArea}"></leaflet-map>
                </div>
                ${this._renderDrawer()}
                <confirm-dialog
                        .open="${this.areaToDelete !== null}"
                        title="${t('map.deleteTitle')}"
                        message="${this.areaToDelete
                                ? t('map.deleteMessage', {name: this.areaToDelete.name})
                                : ''}"
                        confirmLabel="${t('map.delete')}"
                        cancelLabel="${t('common.cancel')}"
                        @confirm="${() => this._confirmRemoveArea()}"
                        @cancel="${() => this._cancelRemoveArea()}">
                </confirm-dialog>
            </div>
        `;
    }

    _renderDrawer() {
        return html`
            <drawer-component
                    class="${this.isEditMode ? 'open' : ''}"
                    .open="${this.isEditMode}"
                    @drawer-close="${() => this._closeDrawer()}">
                <div class="drawer-content" slot="content">
                    <h3 class="drawer-title">
                        <custom-icon label="edit_location_alt"></custom-icon>
                        ${t('map.editor')}
                    </h3>
                    <div class="drawer-content-body">
                        <div class="card">
                            <div class="card-header">
                                <span>${t('map.currentSection')}</span>
                                <span class="badge">${this.selectedArea.vertices.length}</span>
                            </div>
                            <div class="field">
                                <label class="field-label" for="area-name">${t('map.name')}</label>
                                <input id="area-name" type="text" class="text-input"
                                       placeholder="${t('map.namePlaceholder')}"
                                       .value="${this.selectedArea.name}"
                                       @input="${this._updateAreaName}">


                                <label class="field-label" for="area-descriptor">${t('map.description')}</label>
                                <textarea id="area-descriptor" class="text-input"
                                          rows="5" cols="15"
                                          placeholder="${t('map.descriptionPlaceholder')}"
                                          .value="${this.selectedArea.description}"
                                          @input="${this._updateAreaDescription}">
                                    </textarea>
                            </div>
                            <div class="field">
                                <custom-slider
                                        style="--slider-color: var(${this.selectedArea.colorVar})"
                                        label="${t('map.goldPresence')}"
                                        .min="${Area.GOLD_PRESENCE_MIN}"
                                        .max="${Area.GOLD_PRESENCE_MAX}"
                                        .step="${1}"
                                        .value="${this.selectedArea.goldPresence}"
                                        .format="${v => v === Area.GOLD_PRESENCE_MIN
                                                ? t('map.goldPresenceUnset')
                                                : `${v} / ${Area.GOLD_PRESENCE_MAX}`}"
                                        @slider-change="${this._updateAreaGoldPresence}">
                                </custom-slider>
                            </div>
                            
                            <div class="field row-list">
                                ${this._renderCurrentAreaVertices()}
                            </div>



                            <div class="drawer-actions">
                                <custom-button label="${t('map.save')}" icon="save" .active="${true}"
                                               @click="${() => this._createArea()}"></custom-button>
                                <custom-button label="${t('map.reset')}" icon="restart_alt"
                                               @click="${() => this._resetCurrentArea()}"></custom-button>
                            </div>
                        </div>

                        <collapsible-component label="${t('map.savedSections')}" open>
                            <span slot="header-end" class="badge">${this.mapData.areas.length}</span>
                            <div class="row-list">
                                ${this._renderAreas()}
                            </div>
                        </collapsible-component>
                    </div>
                </div>
            </drawer-component>
        `
    }

    _renderCurrentAreaVertices = () => {
        if (this.selectedArea.vertices.length === 0) {
            return html`
                <div class="empty-state">
                    <custom-icon label="add_location_alt"></custom-icon>
                    <span>${t('map.emptyPoints')}</span>
                </div>`;
        }

        return this.selectedArea.vertices.map(vertex => {
            return html`
                <div class="row point-row">
                    <span class="row-index">${vertex.index + 1}</span>
                    <div class="row-main">
                        <span class="row-title">${t('map.point', {number: vertex.index + 1})}</span>
                        <span class="row-sub">${vertex.lat.toFixed(5)}, ${vertex.lng.toFixed(5)}</span>
                    </div>
                    <div class="row-actions">
                        <custom-button class="icon-btn" icon="remove"
                                       @click="${() => this._removePoint(vertex.uuid)}"></custom-button>
                    </div>
                </div>`;
        });
    }

    _renderAreas = () => {
        if (this.mapData.areas.length === 0) {
            return html`
                <div class="empty-state">
                    <custom-icon label="layers_clear"></custom-icon>
                    <span>${t('map.emptySections')}</span>
                </div>`;
        }

        return this.mapData.areas.map(area => {
            return html`
                <div class="row" @click="${() => this._editArea(area)}">
                    <custom-icon label="hexagon" style="color: var(${area.colorVar})"></custom-icon>
                    <div class="row-main">
                        <span class="row-title">${area.name}</span>
                        <span class="row-sub">${t('map.points', {count: area.vertices.length})}</span>
                    </div>
                    <div class="row-actions">
                        <custom-button class="icon-btn" icon="edit"
                                       @click="${() => this._editArea(area)}"></custom-button>
                        <custom-button class="icon-btn" icon="delete"
                                       @click="${() => this._requestRemoveArea(area)}"></custom-button>
                    </div>
                </div>`;
        })
    }

    mapAddVertex = (lat, lng) => {
        this.selectedArea = this.selectedArea.addVertex(new Vertex(this.selectedArea.vertices.length, lat, lng));
        this.reLoad();
    }


    mapSelectArea = (area) => {
        area.selected = true;
        this.selectedArea.selected = false;
        this.selectedArea = area;
        this.reLoad();
    }

    mapMoveVertex = (uuid, lat, lng) => {
        this.selectedArea = this.selectedArea.updateVertex(uuid, lat, lng);
        this.reLoad();
    }

    _removePoint = uuid => {
        this.selectedArea = this.selectedArea.removeVertex(uuid);
        this.selectedArea.updateVertexIndexes();
        this.reLoad();
    }

    _updateAreaName = e => {
        this.selectedArea.name = e.target.value;
    }

    _updateAreaDescription = e => {
        this.selectedArea.description = e.target.value;
    }

    // A new instance is assigned so the map redraws and previews the color live.
    _updateAreaGoldPresence = e => {
        this.selectedArea = this.selectedArea.withGoldPresence(e.detail.value);
    }

    _editArea = area => {
        this.mapSelectArea(area);
    }

    // Open the confirmation dialog for the given area.
    _requestRemoveArea = area => {
        this.areaToDelete = area;
    }

    _confirmRemoveArea = () => {
        if (this.areaToDelete) {
            this._removeArea(this.areaToDelete.uuid);
        }
        this.areaToDelete = null;
    }

    _cancelRemoveArea = () => {
        this.areaToDelete = null;
    }

    _removeArea = uuid => {
        this.mapData.areas = this.mapData.areas.filter(area => area.uuid !== uuid);
        LocalStorageService.saveMapData(this.mapData);

        // If the area being edited is the one deleted, drop it from the
        // editor so it also disappears from the map right away.
        if (this.selectedArea?.uuid === uuid) {
            this.selectedArea.selected = false;
            this.selectedArea = new Area(t('map.newSection'), "",[], this.defaultGoldPresence, true);
        }

        this.reLoad();
    }

    _createArea = () => {
        this.selectedArea.selected = false;
        const alreadyExsits = this.mapData.areas.filter(area => area.uuid === this.selectedArea.uuid).length > 0

        if(alreadyExsits){
             const index = this.mapData.areas.findIndex(area => area.uuid === this.selectedArea.uuid)
            this.mapData.areas[index] = this.selectedArea
        }else{
            this.mapData.areas.push(this.selectedArea);
        }

        this.selectedArea = new Area(t('map.newSection'), "",[], this.defaultGoldPresence,true);

        LocalStorageService.saveMapData(this.mapData);
        this.reLoad();
    }

    _resetCurrentArea = () => {
        this.selectedArea = new Area(t('map.newSection'), "",[], this.defaultGoldPresence,true);
        this.reLoad();
    }

    _closeDrawer = () => {
        this.selectedArea.selected = false;
        this.selectedArea = new Area(t('map.newSection'), "",[], this.defaultGoldPresence,true);
        this.isEditMode = false
    }

    //------------------------------------------------------------------------------------------------------------------
    // TODO's for this page


    //TODO : clicking on the edge of an area should create a new point


}

customElements.define('map-page', MapPage);
