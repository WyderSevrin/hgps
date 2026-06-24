import { LitElement, html, css } from 'lit';

export class HeaderComponent extends LitElement {
    static styles = css`
        nav {
            background-color: #333;
            padding: 10px;
            display: flex;
            justify-content: center;
            gap: 10px;
        }
        button {
            background: #555;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #777;
        }
        button.active {
            background-color: #ff9800; /* Couleur spécifique pour la page active */
            font-weight: bold;
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
            // Synchronise le hash avec la page actuelle
            this.currentHash = window.location.hash.replace('#', '') || 'home';
        });
    }

    // Méthode pour changer manuellement le hash
    navigateTo(page) {
        window.location.hash = `#${page}`;
    }

    render() {
        return html`
      <nav>
        <button
          class="${this.currentHash === 'home' ? 'active' : ''}"
          @click="${() => this.navigateTo('home')}"
        >
          Home
        </button>
        <button
          class="${this.currentHash === 'map' ? 'active' : ''}"
          @click="${() => this.navigateTo('map')}"
        >
          Map
        </button>
        <button
          class="${this.currentHash === 'guide' ? 'active' : ''}"
          @click="${() => this.navigateTo('guide')}"
        >
          Guide
        </button>
      </nav>
    `;
    }
}

customElements.define('header-component', HeaderComponent);