import {LitElement, html} from 'lit';
import { topDrawerComponentStyles } from './top-drawer-component.styles.js';
import '../icon/icon.js';

/**
 * Drawer anchored to the top center of its (position: relative) container.
 * Closed by default; a centered arrow tab under the panel opens/closes it.
 *
 * @property {boolean} open - whether the panel is expanded (reflected as attribute)
 * @property {string} openLabel - accessible label of the tab when closed
 * @property {string} closeLabel - accessible label of the tab when open
 *
 * Slots:
 *  - default : the panel content
 *
 * Fires a `top-drawer-toggle` CustomEvent with `detail: {open}` when toggled.
 */
export class TopDrawerComponent extends LitElement {
    static styles = topDrawerComponentStyles;

    static properties = {
        open: {type: Boolean, reflect: true},
        openLabel: {type: String},
        closeLabel: {type: String},
    };

    constructor() {
        super();
        this.open = false;
        this.openLabel = 'Open';
        this.closeLabel = 'Close';
    }

    toggle() {
        this.open = !this.open;
        this.dispatchEvent(new CustomEvent('top-drawer-toggle', {
            detail: {open: this.open},
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        const label = this.open ? this.closeLabel : this.openLabel;
        return html`
            <div class="panel">
                <div class="panel-inner" id="panel" ?inert="${!this.open}">
                    <div class="content"><slot></slot></div>
                </div>
            </div>
            <button class="tab"
                    title="${label}"
                    aria-label="${label}"
                    aria-expanded="${this.open}"
                    aria-controls="panel"
                    @click="${() => this.toggle()}">
                <span class="arrow"><custom-icon label="expand_more"></custom-icon></span>
            </button>
        `;
    }
}

customElements.define('top-drawer', TopDrawerComponent);
