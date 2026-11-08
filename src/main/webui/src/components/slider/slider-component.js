import {LitElement, html, css} from 'lit';
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
    static styles = css`
        /* Override --slider-color to tint the track, thumb and value. */
        :host {
            --thumb-size: 1.125rem;
            display: flex;
            flex-direction: column;
            gap: var(--hgps-size-2);
            width: 100%;
        }

        .top {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: var(--hgps-size-2);
        }

        .field-label {
            font-size: 0.72rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03125rem;
            color: var(--hgps-text-subtle);
        }

        .value {
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--slider-color, var(--hgps-accent));
            font-variant-numeric: tabular-nums;
        }

        input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: var(--thumb-size);
            margin: 0;
            background: transparent;
            cursor: pointer;
        }

        input[type="range"]:focus {
            outline: none;
        }

        /* Track: filled part up to the thumb uses the accent color. */
        input[type="range"]::-webkit-slider-runnable-track {
            height: 0.375rem;
            border-radius: 1rem;
            background: linear-gradient(to right,
                var(--slider-color, var(--hgps-accent)) 0 var(--fill),
                var(--hgps-surface-3) var(--fill) 100%);
        }

        input[type="range"]::-moz-range-track {
            height: 0.375rem;
            border-radius: 1rem;
            background: var(--hgps-surface-3);
        }

        input[type="range"]::-moz-range-progress {
            height: 0.375rem;
            border-radius: 1rem;
            background: var(--slider-color, var(--hgps-accent));
        }

        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: var(--thumb-size);
            height: var(--thumb-size);
            margin-top: calc((0.375rem - var(--thumb-size)) / 2);
            border-radius: 50%;
            background: var(--slider-color, var(--hgps-accent));
            border: 0.125rem solid var(--hgps-bg);
            box-shadow: 0 0 0 0.0625rem var(--slider-color, var(--hgps-accent));
            transition: transform 0.15s ease;
        }

        input[type="range"]::-moz-range-thumb {
            width: var(--thumb-size);
            height: var(--thumb-size);
            border-radius: 50%;
            background: var(--slider-color, var(--hgps-accent));
            border: 0.125rem solid var(--hgps-bg);
            box-shadow: 0 0 0 0.0625rem var(--slider-color, var(--hgps-accent));
        }

        input[type="range"]:hover::-webkit-slider-thumb {
            transform: scale(1.1);
        }

        input[type="range"]:focus-visible::-webkit-slider-thumb {
            box-shadow: 0 0 0 var(--hgps-size-1) var(--hgps-accent-ring);
        }

        input[type="range"]:focus-visible::-moz-range-thumb {
            box-shadow: 0 0 0 var(--hgps-size-1) var(--hgps-accent-ring);
        }

        /* Numbered scale; side padding of half a thumb lines numbers up with thumb positions. */
        .ticks {
            display: flex;
            justify-content: space-between;
            padding: 0 calc(var(--thumb-size) / 2);
            font-size: 0.7rem;
            color: var(--hgps-text-faint);
            font-variant-numeric: tabular-nums;
        }

        .ticks span {
            width: 0;
            display: flex;
            justify-content: center;
        }

        .ticks span.active {
            color: var(--slider-color, var(--hgps-accent));
            font-weight: 700;
        }
    `;

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
