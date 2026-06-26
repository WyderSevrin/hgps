import { LitElement, html, css } from 'lit';

export class SideBarComponent extends LitElement {
    static styles = css`
        aside {
            background-color: #333;
            width: 100%;
            padding: 0px;
            height: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .aside-container {
            height: 100%;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    `;

    static properties = {
        currentHash: { type: String },
    };

    constructor() {
        super();
        this.currentHash = window.location.hash.replace('#', '') || 'home'; // Page par défaut ou hash actuel
    }

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('hashchange', () => {
            this.currentHash = window.location.hash.replace('#', '') || 'home';
        });
    }

    navigateTo(page) {
        window.location.hash = `#${page}`;
    }

    render() {
        return html`
            <aside>
                <div class="aside-container">
                    <custom-button
                            .active="${this.currentHash === 'home'}"
                            label="Home"
                            icon="home"
                            @click="${() => this.navigateTo('home')}"
                    >
                    </custom-button>
                    <custom-button
                            .active="${(this.currentHash === 'map')}"
                            label="Map"
                            icon="map"
                            @click="${() => this.navigateTo('map')}"
                    >
                    </custom-button>
                    <custom-button
                            .active="${(this.currentHash === 'guide')}"
                            label="Guide"
                            icon="book"
                            @click="${() => this.navigateTo('guide')}"
                    >
                    </custom-button>
                </div>
            </aside>
        `;
    }
}

customElements.define('side-bar-component', SideBarComponent);