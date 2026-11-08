import {LitElement, html, css} from 'lit';
import {I18nController, t} from '../../services/i18n/i18n.js';

export class DrawerComponent extends LitElement {
    static styles = css`

        :host {
            display: flex;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background-color: var(--hgps-surface);
        }

        .drawer {
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        .drawer-header {
            display: flex;
            flex-direction: row;
        }
        
        .drawer-content{
            height: 100%;
        }
    `;

    static properties = {
        open: {type: Boolean}, // Gère l'état du tiroir (ouvert ou fermé)
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
        this.open = false; // Fermé par défaut
    }

    _closeDrawer() {
        this.open = false;
        // Émettre un évènement pour informer le parent du changement d'état
        this.dispatchEvent(new CustomEvent('drawer-close', {bubbles: true, composed: true}));
    }

    render() {
        return html`
            <div class="drawer ${this.open ? 'open' : ''}">

                <div class="drawer-header">
                    <custom-button
                            label="${t('common.close')}"
                            icon="close"
                            @click="${() => this._closeDrawer()}"
                    >
                    </custom-button>
                </div>

                <div class="drawer-content">
                    <slot name="content"></slot>
                </div>

            </div>
        `;
    }
}

customElements.define('drawer-component', DrawerComponent);
