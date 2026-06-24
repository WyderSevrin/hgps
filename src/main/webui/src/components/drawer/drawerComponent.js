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
        content: {type: String}, // Contenu dynamique inséré pour le tiroir
    };

    constructor() {
        super();
        this.open = false; // Fermé par défaut
        this.content = ''; // Pas de contenu par défaut
        this._onGlobalOpenDrawer = this._onGlobalOpenDrawer.bind(this); // Bind events
        this._onGlobalCloseDrawer = this._onGlobalCloseDrawer.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        // Écoute des événements globaux
        window.addEventListener('open-drawer', this._onGlobalOpenDrawer);
        window.addEventListener('close-drawer', this._onGlobalCloseDrawer);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Suppression des écouteurs d'événements
        window.removeEventListener('open-drawer', this._onGlobalOpenDrawer);
        window.removeEventListener('close-drawer', this._onGlobalCloseDrawer);
    }

    _onGlobalOpenDrawer(event) {
        this.open = true;
        this.content = event.detail.content || '';
    }

    _onGlobalCloseDrawer() {
        this.open = false;
    }

    _closeDrawer() {
        this.open = false;
        // Émettre un évènement pour informer du changement d'état
        this.dispatchEvent(new CustomEvent('close-drawer', {bubbles: true, composed: true}));
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
                    ${this.content ? html`
                        <div>${this.content}</div>` : html`
                        <slot></slot>`}
                </div>

            </div>
        `;
    }
}

customElements.define('drawer-component', DrawerComponent);