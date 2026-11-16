// confirmDialogComponent.styles.js
import { css } from 'lit';

export const confirmDialogComponentStyles = css`
    :host {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: none;
    }

    :host([open]) {
        display: block;
    }

    .backdrop {
        position: absolute;
        inset: 0;
        background: var(--hgps-overlay);
        backdrop-filter: blur(2px);
    }

    .dialog {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(90vw, 380px);
        box-sizing: border-box;
        background-color: var(--hgps-surface);
        border: 1px solid var(--hgps-border);
        border-radius: 12px;
        box-shadow: 0 10px 30px var(--hgps-shadow);
        color: var(--hgps-text);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        overflow: hidden;
    }

    .dialog-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px;
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--hgps-text-strong);
        border-bottom: 1px solid var(--hgps-border);
    }

    .dialog-header custom-icon {
        color: var(--hgps-danger-text);
    }

    .dialog-body {
        padding: 16px;
        font-size: 0.9rem;
        line-height: 1.5;
        color: var(--hgps-text-muted);
    }

    .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid var(--hgps-border);
        background-color: var(--hgps-bg);
    }

    .btn-danger {
        background-color: var(--hgps-danger);
        color: var(--hgps-text-strong);
    }

    .btn-danger:hover {
        background-color: var(--hgps-danger-hover);
    }

`;
