import { LitElement, html } from 'lit';
import { sideBarComponentStyles } from './SideBarComponent.styles.js';
import { I18nController, t } from '../../services/i18n/i18n.js';

export class SideBarComponent extends LitElement {
    static styles = sideBarComponentStyles;

    static properties = {
        currentHash: { type: String },
        collapsed: { type: Boolean, state: true },
    };

    constructor() {
        super();
        this.i18n = new I18nController(this);
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
                            label="${t('sidebar.toggle')}"
                            icon="${this.collapsed ? 'menu' : 'menu_open'}"
                            .iconOnly="${true}"
                            @click="${() => this.toggleCollapsed()}"
                    >
                    </custom-button>
                    <custom-button
                            .active="${this.currentHash === 'home'}"
                            label="${t('sidebar.home')}"
                            icon="home"
                            .iconOnly="${this.collapsed}"
                            @click="${() => this.navigateTo('home')}"
                    >
                    </custom-button>
                    <custom-button
                            .active="${(this.currentHash === 'map')}"
                            label="${t('sidebar.map')}"
                            icon="map"
                            .iconOnly="${this.collapsed}"
                            @click="${() => this.navigateTo('map')}"
                    >
                    </custom-button>
                    <custom-button
                            .active="${(this.currentHash === 'guide')}"
                            label="${t('sidebar.guide')}"
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
