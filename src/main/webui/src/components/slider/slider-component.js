import {LitElement, html} from 'lit';
import { fieldLabelStyles } from '../../styles/shared.styles.js';
import { sliderComponentStyles } from './slider-component.styles.js';
import {live} from 'lit/directives/live.js';

/**
 * Reusable range slider.
 *
 * @property {number} min - lowest value (default 0)
 * @property {number} max - highest value (default 5)
 * @property {number} step - increment between values (default 1)
 * @property {number} value - current value
 * @property {string} label - optional field label rendered above the slider
 * @property {Function} format - optional (value) => string used for the displayed value
 * @property {boolean} ticks - show a numbered scale under the track (default true)
 *
 * Fires a `slider-change` CustomEvent with `detail: {value}` (a number)
 * every time the value changes while dragging.
 */
export class SliderComponent extends LitElement {
    static styles = [fieldLabelStyles, sliderComponentStyles];

    static properties = {
        min: {type: Number},
        max: {type: Number},
        step: {type: Number},
        value: {type: Number},
        label: {type: String},
        format: {attribute: false},
        ticks: {type: Boolean},
    };

    constructor() {
        super();
        this.min = 0;
        this.max = 5;
        this.step = 1;
        this.value = 0;
        this.label = '';
        this.format = value => String(value);
        this.ticks = true;
    }

    get _clampedValue() {
        const value = Number(this.value);
        if (Number.isNaN(value)) return this.min;
        return Math.min(this.max, Math.max(this.min, value));
    }

    get _fillPercent() {
        const range = this.max - this.min;
        return range > 0 ? ((this._clampedValue - this.min) / range) * 100 : 0;
    }

    render() {
        const value = this._clampedValue;
        const text = this.format(value);
        const tickValues = [];
        for (let v = this.min; v <= this.max; v += this.step) tickValues.push(v);

        return html`
            <div class="top">
                ${this.label ? html`<label class="field-label" for="range">${this.label}</label>` : null}
                <span class="value">${text}</span>
            </div>
            <input id="range" type="range"
                   style="--fill: ${this._fillPercent}%"
                   min="${this.min}" max="${this.max}" step="${this.step}"
                   .value="${live(String(value))}"
                   aria-valuetext="${text}"
                   @input="${this._onInput}">
            ${this.ticks ? html`
                <div class="ticks" aria-hidden="true">
                    ${tickValues.map(v => html`<span class="${v === value ? 'active' : ''}">${v}</span>`)}
                </div>` : null}
        `;
    }

    _onInput(e) {
        this.value = Number(e.target.value);
        this.dispatchEvent(new CustomEvent('slider-change', {
            detail: {value: this.value},
            bubbles: true,
            composed: true,
        }));
    }
}

customElements.define('custom-slider', SliderComponent);
