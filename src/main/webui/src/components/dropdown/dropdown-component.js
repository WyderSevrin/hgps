import {LitElement, html, css} from 'lit';
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
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-2);
            width: 100%;
        }

        .field-label {
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03125rem;
            color: var(--hgps-text-subtle);
        }

        select {
            width: 100%;
            box-sizing: border-box;
            /* extra right padding leaves room for the custom arrow */
            padding: var(--hgps-size-2) var(--hgps-size-8) var(--hgps-size-2) var(--hgps-size-3);
            background-color: var(--hgps-bg);
            border: thin solid var(--hgps-border-strong);
            border-radius: var(--hgps-size-2);
            color: var(--hgps-text);
            font-size: 0.9rem;
            outline: none;
            cursor: pointer;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;

            /* replace the native arrow with a custom one for consistent placement */
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right var(--hgps-size-3) center;
            background-size: 1rem;
        }

        select:focus {
            border-color: var(--hgps-accent);
            box-shadow: 0 0 0 var(--hgps-size-1) var(--hgps-accent-ring);
        }
    `;

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
