// modal-component.styles.js
import { css } from 'lit';

export const modalComponentStyles = css`
    dialog {
        width: min(92vw, var(--modal-width, 28rem));
        max-height: min(88vh, var(--modal-max-height, 40rem));
        padding: 0;
        box-sizing: border-box;
        background-color: var(--hgps-surface);
        border: thin solid var(--hgps-border);
        border-radius: var(--hgps-size-3);
        box-shadow: 0 0.625rem 1.875rem var(--hgps-shadow);
        color: var(--hgps-text);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        overflow: hidden;
    }

    dialog[open] {
        display: flex;
        flex-direction: column;
    }

    dialog::backdrop {
        background: var(--hgps-overlay);
        backdrop-filter: blur(2px);
    }

    .header {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-3) var(--hgps-size-3) var(--hgps-size-3) var(--hgps-size-4);
        border-bottom: thin solid var(--hgps-border);
    }

    .header > custom-icon {
        color: var(--hgps-accent);
    }

    .title {
        flex: 1;
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--hgps-text-strong);
    }

    .close {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--hgps-size-8);
        height: var(--hgps-size-8);
        border-radius: 50%;
        color: var(--hgps-text-muted);
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease;
    }

    .close:hover {
        background-color: var(--hgps-surface-3);
        color: var(--hgps-text-strong);
    }

    .body {
        flex: 1;
        overflow-y: auto;
        padding: var(--modal-body-padding, var(--hgps-size-4));
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-3) var(--hgps-size-4);
        border-top: thin solid var(--hgps-border);
        background-color: var(--hgps-bg);
    }

    .btn-save {
        background-color: var(--hgps-accent);
        color: var(--hgps-accent-contrast);
    }

    .btn-save:hover {
        background-color: var(--hgps-accent-hover);
    }

    .close:focus-visible,
    .btn:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: 0.125rem;
    }
`;
