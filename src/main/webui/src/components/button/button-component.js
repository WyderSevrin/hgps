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
            background: var(--hgps-surface-3);
            color: var(--hgps-text);
            border: none;
            padding: 10px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            display: flex;
            align-items: center; /* Aligner l'icône et le texte proprement */
            gap: 8px; /* Espacement entre l'icône et le texte */
            box-sizing: border-box;
            white-space: nowrap; /* avoid label wrapping while the sidebar resizes */
            overflow: hidden;
        }

        button.icon-only {
            justify-content: center; /* center the lone icon when the label is hidden */
            gap: 0;
        }

        button.active {
            background-color: var(--hgps-accent); /* Couleur spécifique pour la page active */
            color: var(--hgps-accent-contrast);
            font-weight: bold;
        }

        button:hover {
            background-color: var(--hgps-surface-hover);
        }

        button.active:hover {
            background-color: var(--hgps-accent-hover);
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
        iconOnly: {type: Boolean}, // hide the label and show only the icon
    };

    render() {
        return html`
            <button
                    class="${this.active === true ? "active" : ""} ${this.iconOnly ? "icon-only" : ""}"
                    title="${this.label}"
                    @click=${this._navigate}>
                ${this.icon
                        ? html`<custom-icon label="${this.icon}"></custom-icon>`
                        : null}
                ${this.iconOnly ? null : this.label}
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