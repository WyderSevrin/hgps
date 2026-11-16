// collapsible-component.styles.js
import { css } from 'lit';

export const collapsibleComponentStyles = css`
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
