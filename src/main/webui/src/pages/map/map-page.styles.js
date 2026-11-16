// map-page.styles.js
import { css } from 'lit';

export const mapPageStyles = css`
    :host {
        display: flex;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    textarea {
        resize: none;
    }

    .map-container {
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        border: thin solid var(--hgps-border);
        box-sizing: border-box;
    }

    .flex-vertical { /* the wrapper around the map + the floating nav */
        position: relative; /* positioning context for the overlaid nav */
        display: flex;
        flex-direction: column;
        flex: 1; /* take all available width */
        min-width: 0; /* allow shrinking below content size */
        min-height: 0;
    }

    .map-nav {
        position: absolute; /* float over the map instead of taking its own row */
        top: var(--hgps-size-3);
        right: var(--hgps-size-3);
        z-index: 1000; /* above the Leaflet tiles/controls */
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        gap: var(--hgps-size-1);
    }

    /* Top drawer (search + filters), floating over the top center of the map */

    .top-drawer-content {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-4);
    }

    .search {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search custom-icon {
        position: absolute;
        left: var(--hgps-size-3);
        color: var(--hgps-text-subtle);
        pointer-events: none;
    }

    .search .text-input {
        padding-left: calc(var(--hgps-size-3) * 2 + 1.25rem);
    }

    leaflet-map {
        flex: 1; /* fill remaining height under the nav */
        width: 100%; /* was 75vw  */
        min-height: 0;
        border: thin solid var(--hgps-border);
    }

    .map-nav custom-button {
        width: 6.25rem;
    }

    /* The drawer is a flex sibling of the map; it slides open via its width. */

    drawer-component {
        width: 0;
        overflow: hidden;
        transition: width 0.3s ease;
    }

    drawer-component.open {
        width: max(28%, 21.25rem);
    }


    /* Custom Drawer css */

    .drawer-content {
        height: 100%;
        box-sizing: border-box;
        padding: var(--hgps-size-4);
        color: var(--hgps-text);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    }

    .drawer-title {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-2);
        margin: 0 0 var(--hgps-size-3);
        font-size: 1.05rem;
        font-weight: 600;
        letter-spacing: 0.0125rem;
        color: var(--hgps-text-strong);
    }

    .drawer-title custom-icon {
        color: var(--hgps-accent);
    }

    .drawer-content-body {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-4);
        height: calc(100% - var(--hgps-size-10));
    }

    /* Card wrapper for each logical block of the drawer */

    .card {
        display: flex;
        flex-direction: column;
        background-color: var(--hgps-surface);
        border: thin solid var(--hgps-border);
        border-radius: var(--hgps-size-3);
        overflow: hidden;
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-3);
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.0375rem;
        color: var(--hgps-text-muted);
        background-color: var(--hgps-surface-2);
        border-bottom: thin solid var(--hgps-border);
    }

    .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: var(--hgps-size-6);
        height: var(--hgps-size-5);
        padding: 0 var(--hgps-size-2);
        border-radius: var(--hgps-size-10);
        background-color: var(--hgps-accent);
        color: var(--hgps-accent-contrast);
        font-size: 0.72rem;
        font-weight: 700;
    }

    /* Labeled form field (e.g. area name) inside a card */

    .field {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-3);
        border-bottom: thin solid var(--hgps-border);
    }

    .text-input {
        width: 100%;
        box-sizing: border-box;
        padding: var(--hgps-size-2) var(--hgps-size-3);
        background-color: var(--hgps-bg);
        border: thin solid var(--hgps-border-strong);
        border-radius: var(--hgps-size-2);
        color: var(--hgps-text);
        font-size: 0.9rem;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .text-input::placeholder {
        color: var(--hgps-text-faint);
    }

    .text-input:focus {
        border-color: var(--hgps-accent);
        box-shadow: 0 0 0 var(--hgps-size-1) var(--hgps-accent-ring);
    }

    /* Scrollable list of rows inside a card */

    .row-list {
        display: flex;
        flex-direction: column;
        height: 15rem;
        overflow-y: auto;
    }

    .row {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-3);
        padding: var(--hgps-size-2) var(--hgps-size-3);
        border-bottom: thin solid var(--hgps-border);
    }

    .row:last-child {
        border-bottom: none;
    }

    .row:hover {
        background-color: var(--hgps-surface-2);
    }

    .row-index {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: var(--hgps-size-6);
        height: var(--hgps-size-6);
        border-radius: var(--hgps-size-2);
        background-color: var(--hgps-surface-3);
        color: var(--hgps-accent);
        font-size: 0.78rem;
        font-weight: 700;
        flex-shrink: 0;
    }

    .row-main {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-1);
        flex: 1;
        min-width: 0;
    }

    .row-title {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--hgps-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .row-sub {
        font-size: 0.72rem;
        color: var(--hgps-text-subtle);
        font-variant-numeric: tabular-nums;
    }

    .row-actions {
        display: flex;
        gap: var(--hgps-size-1);
        flex-shrink: 0;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-5) var(--hgps-size-3);
        text-align: center;
        color: var(--hgps-text-subtle);
        font-size: 0.8rem;
    }

    .empty-state custom-icon {
        color: var(--hgps-text-faint);
    }

    .drawer-actions {
        display: flex;
        flex-direction: row;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-3);
        border-top: thin solid var(--hgps-border);
        background-color: var(--hgps-bg);
    }

    .drawer-actions custom-button {
        flex: 1;
    }

    /* Compact icon-only buttons used inside rows */

    .icon-btn {
        width: var(--hgps-size-9);
    }
`;
