import {LitElement, html, css} from 'lit';

export class DrawerComponent extends LitElement {
    static styles = css`

        :host {
            display: flex;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background-color: #333;
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
    `;

    static properties = {
        open: {type: Boolean}, // Gère l'état du tiroir (ouvert ou fermé)
    };

    constructor() {
        super();
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
                            label="Close"
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
