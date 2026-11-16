import {LitElement, html} from 'lit';
import { collapsibleComponentStyles } from './collapsible-component.styles.js';
import '../icon/icon.js';

/**
 * Reusable collapsible card.
 *
 * @property {string} label - text shown in the clickable header
 * @property {boolean} open - whether the content is expanded (reflected as attribute)
 *
 * Slots:
 *  - default      : the collapsible content
 *  - header-end   : optional content pinned to the right of the header (e.g. a badge)
 *
 * Fires a `collapsible-toggle` CustomEvent with `detail: {open}` when toggled.
 */
export class CollapsibleComponent extends LitElement {
    static styles = collapsibleComponentStyles;

    static properties = {
        label: {type: String},
        open: {type: Boolean, reflect: true},
    };

    constructor() {
        super();
        this.label = '';
        this.open = false;
    }

    toggle() {
        this.open = !this.open;
        this.dispatchEvent(new CustomEvent('collapsible-toggle', {
            detail: {open: this.open},
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        return html`
            <button class="header"
                    aria-expanded="${this.open}"
                    aria-controls="content"
                    @click="${() => this.toggle()}">
                <span class="chevron"><custom-icon label="expand_more"></custom-icon></span>
                <span class="label">${this.label}</span>
                <slot name="header-end"></slot>
            </button>
            <div class="body">
                <div class="body-inner" id="content" ?inert="${!this.open}">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('collapsible-component', CollapsibleComponent);
