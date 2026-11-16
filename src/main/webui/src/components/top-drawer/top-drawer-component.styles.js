// top-drawer-component.styles.js
import { css } from 'lit';

export const topDrawerComponentStyles = css`
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
