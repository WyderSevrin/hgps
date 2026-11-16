// gold-presence-filter.styles.js
import { css } from 'lit';

export const goldPresenceFilterStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .all {
        all: unset;
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--hgps-accent);
        cursor: pointer;
    }

    .all:hover { text-decoration: underline; }

    .all:focus-visible,
    .chip:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: 0.125rem;
    }

    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--hgps-size-2);
    }

    .chip {
        all: unset;
        display: inline-flex;
        align-items: center;
        gap: var(--hgps-size-1);
        padding: var(--hgps-size-1) var(--hgps-size-3);
        border-radius: var(--hgps-size-10);
        border: thin solid var(--chip-color);
        color: var(--hgps-text-muted);
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        opacity: 0.55;
        transition: background-color 0.15s ease, opacity 0.15s ease;
    }

    .chip .dot {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background-color: var(--chip-color);
    }

    .chip[aria-pressed="true"] {
        opacity: 1;
        color: var(--hgps-text-strong);
        background-color: color-mix(in srgb, var(--chip-color) 25%, transparent);
    }
`;
