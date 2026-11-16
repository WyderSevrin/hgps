// guide-page.styles.js
import { css } from 'lit';

export const guidePageStyles = css`
    :host {
        display: block;
        height: 100%;
    }

    h1 {
        color: var(--hgps-accent);
    }

    .page {
        height: 100%;
    }

    .page-content {
        height: 100%;
    }

    .summary {
        margin: var(--hgps-size-3);
        padding: var(--hgps-size-5);
        width: fit-content;
        border-radius: var(--hgps-size-3);
        background-color: color-mix(in srgb, var(--hgps-surface-2) 95%, transparent);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-3);
        z-index: 100;
        position: fixed;
        right: var(--hgps-size-8);
        overflow: hidden;
        transition:
            width 0.25s ease,
            background-color 0.25s ease;
    }

    .summary.collapsed {
        width: calc(var(--hgps-size-9) + var(--hgps-size-5));
        background-color: transparent;
    }

    .summary.collapsed .summary-toggle {
        background-color: var(--hgps-surface-2);
        transform: rotate(180deg);
    }

    .summary-toggle {
        all: unset;
        align-self: flex-end;
        width: var(--hgps-size-9);
        height: var(--hgps-size-9);
        border-radius: var(--hgps-size-2);
        color: var(--hgps-accent);
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color 0.15s ease,
            transform 0.25s ease;
    }

    .summary-toggle:hover,
    .summary-toggle:focus-visible {
        background-color: var(--hgps-surface-hover);
    }

    .summary-toggle:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: 0.125rem;
    }

    .summary-items {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-3);
        width: 100%;
        overflow: hidden;
        opacity: 1;
        transform: translateX(0);
        transition:
            opacity 0.2s ease,
            max-height 0.25s ease,
            transform 0.25s ease;
    }

    .summary.collapsed .summary-items {
        pointer-events: none;
        opacity: 0;
        max-height: 0;
        transform: translateX(calc(0rem - var(--hgps-size-3)));
    }

    .summary-item {
        all: unset;
        cursor: pointer;
        padding: var(--hgps-size-2) var(--hgps-size-3);
        border-radius: var(--hgps-size-2);
        color: var(--hgps-accent);
        font-size: var(--hgps-font-size-3);
        font-weight: 600;
        white-space: nowrap;
        transition: background-color 0.15s ease;
    }

    .summary-item:hover,
    .summary-item:focus-visible {
        background-color: var(--hgps-surface-3);
    }

    .guide-content {
        height: 100%;
        box-sizing: border-box;
        padding: var(--hgps-size-8);
        overflow-y: auto;
        scroll-behavior: smooth;
    }

    .guide-section {
        scroll-margin-top: var(--hgps-size-5);
        margin-bottom: var(--hgps-size-10);
    }
`;
