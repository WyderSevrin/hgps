// user-picker.styles.js
import { css } from 'lit';

export const userPickerStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
    }

    /* ---- Search input ---- */
    .search {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-2);
        padding: 0 var(--hgps-size-3);
        background-color: var(--hgps-bg);
        border: thin solid var(--hgps-border-strong);
        border-radius: var(--hgps-size-2);
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .search:focus-within {
        border-color: var(--hgps-accent);
        box-shadow: 0 0 0 var(--hgps-size-1) var(--hgps-accent-ring);
    }

    .search custom-icon {
        color: var(--hgps-text-subtle);
    }

    .search input {
        flex: 1;
        min-width: 0;
        height: 2.25rem;
        border: none;
        outline: none;
        background: transparent;
        color: var(--hgps-text);
        font: inherit;
        font-size: 0.9rem;
    }

    .search input::placeholder {
        color: var(--hgps-text-faint);
    }

    .spinner {
        flex: 0 0 auto;
        width: 1rem;
        height: 1rem;
        border: 0.125rem solid var(--hgps-border-strong);
        border-top-color: var(--hgps-accent);
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .hint {
        margin: 0;
        padding: 0 var(--hgps-size-1);
        font-size: 0.8rem;
        color: var(--hgps-text-subtle);
    }

    .hint.error {
        color: var(--hgps-danger-text);
    }

    /* ---- Results: each row is a button that adds / removes the user ---- */
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    .results {
        max-height: 12rem;
        overflow-y: auto;
        border: thin solid var(--hgps-border);
        border-radius: var(--hgps-size-2);
    }

    .results li + li {
        border-top: thin solid var(--hgps-border);
    }

    .result {
        all: unset;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-2) var(--hgps-size-3);
        cursor: pointer;
    }

    .result:hover,
    .result:focus-visible {
        background-color: var(--hgps-surface-2);
    }

    .result:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: -0.125rem;
    }

    .result custom-icon {
        color: var(--hgps-text-faint);
    }

    .result.selected custom-icon {
        color: var(--hgps-accent);
    }

    .names {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .display-name {
        font-size: 0.86rem;
        font-weight: 600;
        color: var(--hgps-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .username {
        font-size: 0.74rem;
        color: var(--hgps-text-subtle);
    }

    /* ---- Selected users, as chips ---- */
    .selected-users {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-1);
    }

    .selected-label {
        font-size: 0.72rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03125rem;
        color: var(--hgps-text-subtle);
    }

    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--hgps-size-1);
    }

    .chip {
        display: inline-flex;
        align-items: center;
        gap: var(--hgps-size-1);
        padding: 0.15rem 0.15rem 0.15rem var(--hgps-size-3);
        border-radius: 1rem;
        background-color: var(--hgps-accent);
        color: var(--hgps-accent-contrast);
        font-size: 0.8rem;
        font-weight: 600;
    }

    .chip-remove {
        all: unset;
        display: inline-flex;
        border-radius: 50%;
        cursor: pointer;
    }

    .chip-remove:hover,
    .chip-remove:focus-visible {
        background-color: var(--hgps-overlay);
    }

    .chip-remove custom-icon {
        transform: scale(0.75);
    }
`;
