// notifications-menu.styles.js
import { css } from 'lit';

export const notificationsMenuStyles = css`
    .trigger {
        position: relative;
    }

    .trigger:hover,
    :host([open]) .trigger {
        background-color: var(--hgps-header-control-hover);
        border-color: var(--hgps-gold-bright);
    }

    .badge {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 18px;
        height: 18px;
        padding: 0 4px;
        box-sizing: border-box;
        border-radius: 9px;
        background-color: var(--hgps-danger);
        color: var(--hgps-text-strong);
        border: 2px solid var(--hgps-slate-deep);
        font-size: 10px;
        font-weight: 700;
        line-height: 14px;
        text-align: center;
    }

    /* ---- Bubble ---- */
    .bubble {
        width: min(22rem, calc(100vw - 24px));
        color: var(--hgps-text);
    }

    .bubble-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--hgps-size-3) var(--hgps-size-4);
        border-bottom: thin solid var(--hgps-border);
    }

    .bubble-title {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--hgps-text-strong);
    }

    .clear-all {
        padding: var(--hgps-size-1) var(--hgps-size-2);
        border: none;
        border-radius: var(--hgps-size-2);
        background: none;
        color: var(--hgps-accent);
        font: inherit;
        font-size: 0.78rem;
        cursor: pointer;
    }

    .clear-all:hover {
        background-color: var(--hgps-surface-2);
    }

    ul {
        list-style: none;
        margin: 0;
        padding: var(--hgps-size-1);
        max-height: min(60vh, 24rem);
        overflow-y: auto;
    }

    li {
        display: flex;
        align-items: flex-start;
        gap: var(--hgps-size-3);
        padding: var(--hgps-size-3);
        border-radius: var(--hgps-size-2);
    }

    li:hover {
        background-color: var(--hgps-surface-2);
    }

    .type-icon {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background-color: var(--hgps-surface-3);
        color: var(--hgps-text-muted);
    }

    li.unread .type-icon {
        background-color: color-mix(in srgb, var(--hgps-accent) 20%, transparent);
        color: var(--hgps-accent);
    }

    .text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
    }

    .message {
        font-size: 0.86rem;
        line-height: 1.35;
        color: var(--hgps-text-muted);
    }

    li.unread .message {
        color: var(--hgps-text-strong);
    }

    time {
        font-size: 0.74rem;
        color: var(--hgps-text-subtle);
    }

    .dot {
        flex: 0 0 auto;
        width: 0.5rem;
        height: 0.5rem;
        margin-top: 0.4rem;
        border-radius: 50%;
        background-color: var(--hgps-accent);
    }

    /* Clear one notification: discreet until the row is hovered or the button focused */
    .dismiss {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        padding: 0;
        border: none;
        border-radius: 50%;
        background: none;
        color: var(--hgps-text-subtle);
        cursor: pointer;
        opacity: 0;
    }

    li:hover .dismiss,
    .dismiss:focus-visible {
        opacity: 1;
    }

    .dismiss:hover {
        background-color: var(--hgps-surface-3);
        color: var(--hgps-text-strong);
    }

    /* Touch screens have no hover: always show it */
    @media (hover: none) {
        .dismiss { opacity: 1; }
    }

    .empty {
        font-size: 0.86rem;
    }

`;
