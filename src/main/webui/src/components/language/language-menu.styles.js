// language-menu.styles.js
import { css } from 'lit';

export const languageMenuStyles = css`
    .flag {
        display: block;
        overflow: hidden;
        border-radius: 50%;
    }

    .flag svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    .trigger {
        position: relative;
        box-sizing: border-box;
        transition: border-color 0.25s ease, box-shadow 0.25s ease;
    }

    .trigger .flag {
        width: 26px;
        height: 26px;
        transition: transform 0.2s ease;
    }

    .trigger:hover,
    :host([open]) .trigger {
        border-color: var(--hgps-gold-bright);
    }

    .trigger:hover .flag {
        transform: scale(1.06);
    }

    /* Small chevron pill, so the button reads as a picker */
    .chevron {
        position: absolute;
        right: -3px;
        bottom: -3px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background-color: var(--hgps-gold);
        color: var(--hgps-accent-contrast);
        border: 2px solid var(--hgps-slate-deep);
        font-size: 10px;
        transition: transform 0.2s ease;
    }

    .chevron svg {
        width: 10px;
        height: 10px;
    }

    :host([open]) .chevron {
        transform: rotate(180deg);
    }

    /* ---- Menu bubble ---- */
    .menu {
        min-width: 11rem;
        margin: 0;
        padding: var(--hgps-size-1);
        list-style: none;
    }

    .option {
        all: unset;
        position: relative; /* above the arrow */
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--hgps-size-3);
        padding: var(--hgps-size-2) var(--hgps-size-3);
        border-radius: var(--hgps-size-2);
        color: var(--hgps-text);
        font-size: 0.88rem;
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    .option:hover,
    .option:focus-visible {
        background-color: var(--hgps-surface-2);
    }

    .option:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: -0.125rem;
    }

    .option .flag {
        flex: 0 0 auto;
        width: 22px;
        height: 22px;
        box-shadow: 0 0 0 1px var(--hgps-border-strong);
    }

    .option .name {
        flex: 1;
    }

    .option .code {
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--hgps-text-subtle);
    }

    .option[aria-checked="true"] {
        color: var(--hgps-text-strong);
        font-weight: 600;
    }

    .option[aria-checked="true"] .code {
        color: var(--hgps-accent);
    }

    .check {
        width: 1.25rem;
        color: var(--hgps-accent);
    }

    @media (prefers-reduced-motion: reduce) {
        .chevron, .trigger .flag { transition: none; }
    }
`;
