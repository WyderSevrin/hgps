import {LitElement, html, css} from 'lit';


export class ButtonComponent extends LitElement {
    static styles = css`
        
        * {
            width: 100%;
        }
        
        .material-icons {
            font-size: 24px; /* Taille par défaut de l'icône */
            vertical-align: middle;
        }

        button {
            background: #555;
            color: white;
            border: none;
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: flex;
            align-items: center; /* Aligner l'icône et le texte proprement */
            gap: 8px; /* Espacement entre l'icône et le texte */

        }
        
        button.active {
            background-color: #ff9800; /* Couleur spécifique pour la page active */
            font-weight: bold;
        }

        button:hover {
            background-color: #777;
        }

        .icon {
            font-size: 18px; /* Taille par défaut de l'icône */
        }
        
    `;

    static properties = {
        label: {type: String},
        page: {type: String},
        active: {type: Boolean},
        icon: {type: String},
    };

    render() {
        return html`
            <button
                    class="${this.active === true ? "active" : ""}"
                    @click=${this._navigate}>
                ${this.icon
                        ? html` <custom-icon label="${this.icon}"></custom-icon>`
                        : null}
                ${this.label}
            </button>
        `;
    }

    _navigate() {
        const event = new CustomEvent('navigate', {
            detail: {page: this.page},
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
}

customElements.define('custom-button', ButtonComponent);