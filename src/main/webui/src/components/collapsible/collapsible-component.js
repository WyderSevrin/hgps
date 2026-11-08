import {LitElement, html, css} from 'lit';
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
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            background-color: var(--hgps-surface);
            border: thin solid var(--hgps-border);
            border-radius: var(--hgps-size-3);
            overflow: hidden;
        }

        .header {
            all: unset;
            display: flex;
            align-items: center;
            gap: var(--hgps-size-2);
            padding: var(--hgps-size-3);
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.0375rem;
            color: var(--hgps-text-muted);
            background-color: var(--hgps-surface-2);
            cursor: pointer;
            user-select: none;
            transition: background-color 0.15s ease;
        }

        :host([open]) .header {
            border-bottom: thin solid var(--hgps-border);
        }

        .header:hover {
            background-color: var(--hgps-surface-3);
        }

        .header:focus-visible {
            outline: 0.125rem solid var(--hgps-accent);
            outline-offset: -0.125rem;
        }

        .chevron {
            display: inline-flex;
            color: var(--hgps-accent);
            transform: rotate(-90deg);
            transition: transform 0.2s ease;
        }

        :host([open]) .chevron {
            transform: rotate(0deg);
        }

        .label {
            flex: 1;
            min-width: 0;
        }

        /* Animate height with the grid 0fr -> 1fr trick (no fixed height needed). */
        .body {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.25s ease;
        }

        :host([open]) .body {
            grid-template-rows: 1fr;
        }

        .body-inner {
            min-height: 0;
            overflow: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
            .chevron, .body { transition: none; }
        }
    `;

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
