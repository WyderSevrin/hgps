import {LitElement, html, css} from 'lit';
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
    static styles = css`
        :host {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000; /* above the Leaflet tiles/controls */
            width: min(32rem, 60%);
            display: flex;
            flex-direction: column;
            align-items: center;
            pointer-events: none; /* only the panel and tab catch clicks */
        }

        .panel {
            width: 100%;
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.25s ease;
            pointer-events: auto;
        }

        :host([open]) .panel {
            grid-template-rows: 1fr;
        }

        .panel-inner {
            min-height: 0;
            overflow: hidden;
            box-sizing: border-box;
            background-color: var(--hgps-surface);
            border: 0 solid var(--hgps-border);
            border-radius: 0 0 var(--hgps-size-3) var(--hgps-size-3);
            box-shadow: 0 var(--hgps-size-1) var(--hgps-size-3) var(--hgps-shadow-soft);
        }

        :host([open]) .panel-inner {
            border-width: 0 thin thin thin;
        }

        .content {
            padding: var(--hgps-size-4);
        }

        .tab {
            all: unset;
            pointer-events: auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 3.5rem;
            height: 1.5rem;
            border-radius: 0 0 var(--hgps-size-3) var(--hgps-size-3);
            background-color: var(--hgps-surface);
            border: thin solid var(--hgps-border);
            border-top: none;
            color: var(--hgps-accent);
            box-shadow: 0 var(--hgps-size-1) var(--hgps-size-2) var(--hgps-shadow-soft);
            cursor: pointer;
            transition: background-color 0.15s ease;
        }

        .tab:hover {
            background-color: var(--hgps-surface-2);
        }

        .tab:focus-visible {
            outline: 0.125rem solid var(--hgps-accent);
            outline-offset: 0.125rem;
        }

        .arrow {
            display: inline-flex;
            transition: transform 0.25s ease;
        }

        :host([open]) .arrow {
            transform: rotate(180deg);
        }

        @media (prefers-reduced-motion: reduce) {
            .panel, .arrow { transition: none; }
        }
    `;

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
