import {LitElement, html, css} from 'lit';
import '../components/map/leaflet-map.js';


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
    `;

    constructor() {
        super();
        this.isEditMode = false;
        this._onCloseDrawer = this._onCloseDrawer.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('open-drawer', this._onOpenDrawer);
        window.addEventListener('close-drawer', this._onCloseDrawer);
    }

    disconnectedCallback() {
        window.removeEventListener('open-drawer', this._onOpenDrawer);
        window.removeEventListener('close-drawer', this._onCloseDrawer);
        super.disconnectedCallback();
    }

    _onOpenDrawer = () => {
        this.isEditMode = true;
        this._update();
    }

    _onCloseDrawer = () => {
        this.isEditMode = false;
        this._update();
    }


    _update = () => {
        this.requestUpdate();
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
                    <leaflet-map .editMode="${this.isEditMode}"></leaflet-map>
                </div>
            </div>
        `;
    }

    renderDrawerContent = () => {
        return html`
            <h3>Configuration</h3>
            <p>Votre contenu dynamique ici</p>
        `;
    }


    changeMode = () => {
        this.isEditMode = !this.isEditMode;
        if (this.isEditMode) {
            const newContent =
                this.renderDrawerContent();
            window.dispatchEvent(new CustomEvent('open-drawer', {
                detail: {content: newContent} // Contenu dynamique
            }));
        } else {
            window.dispatchEvent(new CustomEvent('close-drawer'));
        }
        this._update();
    }
}

customElements.define('map-page', MapPage);