import {html, LitElement} from 'lit';
import { fieldLabelStyles, switchStyles } from '../../styles/shared.styles.js';
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
import {MapData} from "../../models/mapData.js";
import {I18nController, t} from "../../services/i18n/i18n.js";
import {auth} from "../../services/auth/authService.js";
import {AreaService} from "../../services/api/areaService.js";


/**
 * The map with the logged-in user's own areas (loaded from and saved to the backend).
 * The areas of other users are not shown here.
 */
export class MapPage extends LitElement {
    static styles = [fieldLabelStyles, switchStyles, mapPageStyles];

    static properties = {
        isEditMode: {type: Boolean, state: true},
        areaToDelete: {type: Object, state: true},
        // Reactive so assigning a new area (e.g. while sliding the gold
        // presence) re-renders the drawer and redraws the map immediately.
        selectedArea: {type: Object, state: true},
        // Gold presence levels whose areas are shown on the map (top drawer filter).
        visibleGoldPresence: {type: Array, state: true},
        // The saved areas. Always replaced by a new MapData (see _setAreas) so the map redraws.
        mapData: {type: Object, state: true},
        // True while a save is in progress, to ignore double clicks.
        saving: {type: Boolean, state: true},
        // Message shown in the editor, null = no error.
        errorMessage: {type: String, state: true},
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.isEditMode = false;
        this.areaToDelete = null;
        // 0 = not determined yet; 1..5 = rated gold presence.
        this.defaultGoldPresence = 0;
        this.visibleGoldPresence = [...GoldPresenceFilter.ALL_LEVELS];
        this.selectedArea = this._newArea();
        this.mapData = new MapData();
        this.saving = false;
        this.errorMessage = null;
    }

    connectedCallback() {
        super.connectedCallback();
        auth.init().then(() => this._loadAreas());
    }

    // ---------------------------------------------------------------- data

    async _loadAreas() {
        if (!auth.authenticated) return; // the router shows the login page instead
        try {
            this._setAreas(await AreaService.listMine());
        } catch (e) {
            this._showError('map.errors.load', e);
        }
    }

    // A new MapData (not a changed one) so leaflet-map notices it and redraws.
    _setAreas(areas) {
        this.mapData = new MapData(areas, this.mapData.points);
    }

    // The empty area the editor starts with.
    _newArea() {
        return new Area(t('map.newSection'), "", [], this.defaultGoldPresence, true);
    }

    _showError(i18nKey, error) {
        console.warn(`[map] ${i18nKey}`, error);
        this.errorMessage = t(i18nKey);
    }

    // The reason the area cannot be saved yet, or null when it can (same rules as the backend).
    _validationError(area) {
        if (!area.name.trim()) {
            return t('map.errors.nameRequired');
        }
        if (area.vertices.length < Area.MIN_VERTICES) {
            return t('map.errors.minPoints', {count: Area.MIN_VERTICES});
        }
        return null;
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
                        ${this.errorMessage
                                ? html`<p class="error-message" role="alert">
                                    <custom-icon label="error"></custom-icon>
                                    ${this.errorMessage}
                                </p>`
                                : null}
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

                            <div class="field">
                                ${this._renderPrivacySwitch()}
                            </div>

                            <div class="drawer-actions">
                                <custom-button label="${this.saving ? t('map.saving') : t('map.save')}"
                                               icon="save" .active="${true}"
                                               @click="${() => this._saveArea()}"></custom-button>
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

    // On = private. The description says who sees the area, which for a public
    // area depends on the user's "public profile" setting (User options > Account).
    _renderPrivacySwitch = () => {
        const {isPrivate} = this.selectedArea;
        const audience = isPrivate ? 'onlyMe'
            : auth.user?.publicProfile ? 'everyone' : 'friends';
        return html`
            <label class="switch">
                <span class="switch-text">
                    <span class="switch-name">${t('map.privacy.label')}</span>
                    <span class="switch-description">${t(`map.privacy.${audience}`)}</span>
                </span>
                <input type="checkbox" role="switch"
                       .checked="${isPrivate}"
                       @change="${this._updateAreaPrivacy}">
            </label>`;
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
                        <span class="row-sub">
                            ${t('map.points', {count: area.vertices.length})}
                            · ${t(area.isPrivate ? 'map.privacy.private' : 'map.privacy.public')}
                        </span>
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
    }

    // The editor works on a copy: the saved area in the list stays unchanged until it is saved.
    mapSelectArea = (area) => {
        this.selectedArea = area.withSelected(true);
        this.errorMessage = null;
    }

    mapMoveVertex = (uuid, lat, lng) => {
        this.selectedArea = this.selectedArea.updateVertex(uuid, lat, lng);
    }

    _removePoint = uuid => {
        this.selectedArea = this.selectedArea.removeVertex(uuid);
        this.selectedArea.updateVertexIndexes();
    }

    _updateAreaName = e => {
        this.selectedArea = this.selectedArea.withName(e.target.value);
    }

    _updateAreaDescription = e => {
        this.selectedArea = this.selectedArea.withDescription(e.target.value);
    }

    _updateAreaPrivacy = e => {
        this.selectedArea = this.selectedArea.withPrivacy(e.target.checked);
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
            this._removeArea(this.areaToDelete);
        }
        this.areaToDelete = null;
    }

    _cancelRemoveArea = () => {
        this.areaToDelete = null;
    }

    _removeArea = async area => {
        try {
            await AreaService.delete(area.uuid);
        } catch (e) {
            this._showError('map.errors.delete', e);
            return;
        }
        this._setAreas(this.mapData.areas.filter(saved => saved.uuid !== area.uuid));

        // If the area being edited is the one deleted, drop it from the
        // editor so it also disappears from the map right away.
        if (this.selectedArea.uuid === area.uuid) {
            this._clearEditor();
        }
    }

    // Creates the area in the backend, or updates it when it was saved before.
    _saveArea = async () => {
        if (this.saving) return;

        const area = this.selectedArea;
        this.errorMessage = this._validationError(area);
        if (this.errorMessage) return;

        this.saving = true;
        try {
            if (area.isSaved) {
                const updated = await AreaService.update(area);
                this._setAreas(this.mapData.areas.map(saved => saved.uuid === updated.uuid ? updated : saved));
            } else {
                const created = await AreaService.create(area);
                this._setAreas([created, ...this.mapData.areas]); // newest first, like the API
            }
            this._clearEditor();
        } catch (e) {
            this._showError('map.errors.save', e);
        } finally {
            this.saving = false;
        }
    }

    // Unsaved changes are dropped: the saved areas in the list were never modified.
    _resetCurrentArea = () => {
        this._clearEditor();
    }

    _closeDrawer = () => {
        this._clearEditor();
        this.isEditMode = false;
    }

    // Back to an empty new area, without an error message.
    _clearEditor() {
        this.selectedArea = this._newArea();
        this.errorMessage = null;
    }

    //------------------------------------------------------------------------------------------------------------------
    // TODO's for this page


    //TODO : clicking on the edge of an area should create a new point


}

customElements.define('map-page', MapPage);
