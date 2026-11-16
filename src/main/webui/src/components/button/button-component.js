import {LitElement, html} from 'lit';
import { buttonComponentStyles } from './button-component.styles.js';


export class ButtonComponent extends LitElement {
    static styles = buttonComponentStyles;

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