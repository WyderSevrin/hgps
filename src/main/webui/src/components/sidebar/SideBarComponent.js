import { LitElement, html, css } from 'lit';

export class SideBarComponent extends LitElement {
    static styles = css`
        aside {
            background-color: var(--hgps-surface);
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            width: 180px;
            transition: width 0.3s ease;
        }

        aside.collapsed {
            width: 64px;
        }

        .aside-container {
            height: 100%;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            box-sizing: border-box;
        }

        /* The toggle sits apart from the navigation buttons. */
        .toggle {
            margin-bottom: 6px;
        }
    `;

    static properties = {
        currentHash: { type: String },
        collapsed: { type: Boolean, state: true },
    };

    constructor() {
        super();
        this.currentHash = window.location.hash.replace('#', '') || 'home'; // Page par défaut ou hash actuel
        this.collapsed = false;
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

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }

    render() {
        return html`
            <aside class="${this.collapsed ? 'collapsed' : ''}">
                <div class="aside-container">
                    <custom-button
                            class="toggle"
                            icon="${this.collapsed ? 'menu' : 'menu_open'}"
                            .iconOnly="${true}"
                            @click="${() => this.toggleCollapsed()}"
                    >
                    </custom-button>
                    <custom-button
                            .active="${this.currentHash === 'home'}"
                            label="Home"
                            icon="home"
                            .iconOnly="${this.collapsed}"
                            @click="${() => this.navigateTo('home')}"
                    >
                    </custom-button>
                    <custom-button
                            .active="${(this.currentHash === 'map')}"
                            label="Map"
                            icon="map"
                            .iconOnly="${this.collapsed}"
                            @click="${() => this.navigateTo('map')}"
                    >
                    </custom-button>
                    <custom-button
                            .active="${(this.currentHash === 'guide')}"
                            label="Guide"
                            icon="book"
                            .iconOnly="${this.collapsed}"
                            @click="${() => this.navigateTo('guide')}"
                    >
                    </custom-button>
                </div>
            </aside>
        `;
    }
}

customElements.define('side-bar-component', SideBarComponent);
