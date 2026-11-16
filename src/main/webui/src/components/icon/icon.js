import { LitElement, html } from 'lit';
import { iconStyles } from './icon.styles.js';


export class Icon extends LitElement {
    static styles = iconStyles;

    static properties = {
        label: { type: String },
    };

    constructor() {
        super();
        this.label = ''; // Exemple d'icône par défaut
    }

    render() {
        return html`
            <i class="material-icons">${this.label}</i>
        `;
    }
}

customElements.define('custom-icon', Icon);