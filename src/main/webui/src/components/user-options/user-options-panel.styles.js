// user-options-panel.styles.js
import { css } from 'lit';

export const userOptionsPanelStyles = css`
    :host {
        display: flex;
        min-height: 22rem;
    }

    /* ---- Side navigation ---- */
    nav {
        flex: 0 0 13rem;
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-1);
        padding: var(--hgps-size-3);
        box-sizing: border-box;
        background-color: var(--hgps-bg);
        border-right: thin solid var(--hgps-border);
    }

    .tab {
        all: unset;
        position: relative;
        display: flex;
        align-items: center;
        gap: var(--hgps-size-3);
        padding: var(--hgps-size-2) var(--hgps-size-3);
        border-radius: var(--hgps-size-2);
        color: var(--hgps-text-muted);
        font-size: 0.88rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease;
    }

    .tab custom-icon {
        color: var(--hgps-text-subtle);
        transition: color 0.15s ease;
    }

    .tab:hover {
        background-color: var(--hgps-surface-2);
        color: var(--hgps-text);
    }

    .tab[aria-selected="true"] {
        background-color: color-mix(in srgb, var(--hgps-accent) 14%, transparent);
        color: var(--hgps-text-strong);
        font-weight: 600;
    }

    .tab[aria-selected="true"] custom-icon {
        color: var(--hgps-accent);
    }

    /* Gold marker on the selected entry */
    .tab[aria-selected="true"]::before {
        content: '';
        position: absolute;
        left: 0;
        top: 20%;
        bottom: 20%;
        width: 0.1875rem;
        border-radius: 0.1875rem;
        background-color: var(--hgps-accent);
    }

    .tab:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: -0.125rem;
    }

    /* ---- Content ---- */
    .content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-4);
        padding: var(--hgps-size-5) var(--hgps-size-6);
        box-sizing: border-box;
    }

    .content-header h3 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--hgps-text-strong);
    }

    .content-header p {
        margin: var(--hgps-size-1) 0 0;
        font-size: 0.84rem;
        color: var(--hgps-text-subtle);
    }

    .empty {
        flex: 1;
        justify-content: center;
        border: thin dashed var(--hgps-border-strong);
        border-radius: var(--hgps-size-3);
        font-size: 0.86rem;
    }

    /* ---- Pickers: cards of the map style and color theme options ---- */
    fieldset {
        margin: 0;
        padding: 0;
        border: none;
        min-width: 0;
    }

    legend {
        padding: 0;
        margin-bottom: var(--hgps-size-1);
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--hgps-text-strong);
    }

    .hint {
        margin: 0 0 var(--hgps-size-3);
        font-size: 0.8rem;
        color: var(--hgps-text-subtle);
    }

    .choices {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
        gap: var(--hgps-size-3);
    }

    .choice {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-2);
        border: thin solid var(--hgps-border);
        border-radius: var(--hgps-size-3);
        background-color: var(--hgps-surface-2);
        cursor: pointer;
        transition: border-color 0.15s ease, background-color 0.15s ease;
    }

    .choice:hover {
        border-color: var(--hgps-border-strong);
    }

    .choice.selected {
        border-color: var(--hgps-accent);
        box-shadow: 0 0 0 1px var(--hgps-accent);
    }

    /* Native radio kept for keyboard / screen readers, visually hidden */
    .choice input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    .choice:has(input:focus-visible) {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: 0.125rem;
    }

    .check {
        position: absolute;
        top: var(--hgps-size-3);
        right: var(--hgps-size-3);
        display: inline-flex;
        border-radius: 50%;
        background-color: var(--hgps-accent);
        color: var(--hgps-accent-contrast);
    }

    .check custom-icon {
        transform: scale(0.7);
    }

    .choice-name {
        font-size: 0.86rem;
        font-weight: 600;
        color: var(--hgps-text-strong);
        padding: 0 var(--hgps-size-1);
    }

    .choice-description {
        font-size: 0.76rem;
        line-height: 1.4;
        color: var(--hgps-text-subtle);
        padding: 0 var(--hgps-size-1) var(--hgps-size-1);
    }

    /* Mini app drawn with the previewed theme's own tokens (set inline). */
    .preview {
        display: flex;
        flex-direction: column;
        height: 5.5rem;
        overflow: hidden;
        border-radius: var(--hgps-size-2);
        border: thin solid var(--hgps-border);
        background: var(--hgps-bg);
    }

    /* Map style preview: one tile of the style */
    img.preview {
        width: 100%;
        box-sizing: border-box;
        object-fit: cover;
        background: var(--hgps-surface-3); /* while loading */
    }

    .p-header {
        flex: 0 0 0.8rem;
        background: var(--hgps-header-bg);
        border-bottom: 2px solid var(--hgps-header-border);
    }

    .p-body {
        flex: 1;
        display: flex;
        gap: 0.35rem;
        padding: 0.4rem;
    }

    .p-side {
        flex: 0 0 0.8rem;
        border-radius: 0.2rem;
        background: var(--hgps-surface);
    }

    .p-card {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.35rem;
        border-radius: 0.25rem;
        border: thin solid var(--hgps-border);
        border-top: 2px solid var(--hgps-accent);
        background: var(--hgps-surface);
    }

    .p-line {
        height: 0.22rem;
        width: 75%;
        border-radius: 0.2rem;
        background: var(--hgps-text);
    }

    .p-line.muted {
        width: 55%;
        background: var(--hgps-text-muted);
    }

    .p-button {
        margin-top: auto;
        width: 1.8rem;
        height: 0.55rem;
        border-radius: 0.2rem;
        background: var(--hgps-accent);
    }

    /* ---- Narrow screens: tabs on top ---- */
    @media (max-width: 40rem) {
        :host {
            flex-direction: column;
        }

        nav {
            flex: 0 0 auto;
            flex-direction: row;
            overflow-x: auto;
            border-right: none;
            border-bottom: thin solid var(--hgps-border);
        }

        .tab {
            flex: 1 0 auto;
            justify-content: center;
        }

        .tab[aria-selected="true"]::before {
            top: auto;
            bottom: 0;
            left: 20%;
            right: 20%;
            width: auto;
            height: 0.1875rem;
        }

        .content {
            padding: var(--hgps-size-4);
        }
    }
`;
