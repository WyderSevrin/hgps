// dropdown-component.styles.js
import { css } from 'lit';

export const dropdownComponentStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
        width: 100%;
    }

    select {
        width: 100%;
        box-sizing: border-box;
        /* extra right padding leaves room for the custom arrow */
        padding: var(--hgps-size-2) var(--hgps-size-8) var(--hgps-size-2) var(--hgps-size-3);
        background-color: var(--hgps-bg);
        border: thin solid var(--hgps-border-strong);
        border-radius: var(--hgps-size-2);
        color: var(--hgps-text);
        font-size: 0.9rem;
        outline: none;
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;

        /* replace the native arrow with a custom one for consistent placement */
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23888' stroke-width='1.5'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right var(--hgps-size-3) center;
        background-size: 1rem;
    }

    select:focus {
        border-color: var(--hgps-accent);
        box-shadow: 0 0 0 var(--hgps-size-1) var(--hgps-accent-ring);
    }
`;
