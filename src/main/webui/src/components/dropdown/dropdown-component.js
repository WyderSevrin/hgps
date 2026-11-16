import {LitElement, html} from 'lit';
import { fieldLabelStyles } from '../../styles/shared.styles.js';
import { dropdownComponentStyles } from './dropdown-component.styles.js';
import {live} from 'lit/directives/live.js';

/**
 * Reusable dropdown.
 *
 * @property {Array<{name: string, value: *}>} options - selectable entries
 * @property {*} value - the currently selected value (matched against option.value)
 * @property {string} label - optional field label rendered above the select
 * @property {string} placeholder - optional first, non-selectable entry
 *
 * Fires a `dropdown-change` CustomEvent with `detail: {value}` when the
 * selection changes.
 */
export class DropdownComponent extends LitElement {
    static styles = [fieldLabelStyles, dropdownComponentStyles];

    static properties = {
        options: {type: Array},
        value: {},
        label: {type: String},
        placeholder: {type: String},
    };

    constructor() {
        super();
        this.options = [];
        this.value = null;
        this.label = "";
        this.placeholder = "";
    }

    render() {
        return html`
            ${this.label
                    ? html`<label class="field-label">${this.label}</label>`
                    : null}
            <select .value="${live(this.value == null ? '' : String(this.value))}"
                    @change="${this._onChange}">
                ${this.placeholder
                        ? html`<option value="" disabled>${this.placeholder}</option>`
                        : null}
                ${this.options.map(option => html`
                    <option value="${option.value}">${option.name}</option>`)}
            </select>
        `;
    }

    _onChange(e) {
        const selected = e.target.value;
        // Recover the original value (with its original type) from the options
        // so consumers get back what they passed in, not the stringified option.
        const match = this.options.find(option => String(option.value) === selected);
        this.value = match ? match.value : selected;

        this.dispatchEvent(new CustomEvent('dropdown-change', {
            detail: {value: this.value},
            bubbles: true,
            composed: true,
        }));
    }
}

customElements.define('custom-dropdown', DropdownComponent);
