import { LitElement, html, css, unsafeCSS } from 'lit';
const materialIconsCss = `
    @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
    }

    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        display: inline-block;
        line-height: 1;
        text-transform: none;
        letter-spacing: normal;
        word-wrap: normal;
        white-space: nowrap;
        direction: ltr;
        -webkit-font-feature-settings: 'liga';
        -webkit-font-smoothing: antialiased;
    }
`;


export class Icon extends LitElement {
    static styles = [
        // Utilisation des styles Material Icons importés
        unsafeCSS(materialIconsCss),
        // Vos propres styles
        css`
            :host {
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .material-icons {
                font-size: 1.5rem;
                color: inherit; /* Permet d'hériter de la couleur du parent */
            }
        `
    ];

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