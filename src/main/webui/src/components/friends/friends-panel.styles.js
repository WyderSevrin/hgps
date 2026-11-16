// friends-panel.styles.js
import { css } from 'lit';

export const friendsPanelStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-4);
    }

    /* ---- Find a user ---- */
    .finder {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
    }

    .search {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-2);
        padding: 0 var(--hgps-size-3);
        background-color: var(--hgps-bg);
        border: thin solid var(--hgps-border);
        border-radius: var(--hgps-size-2);
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .search:focus-within {
        border-color: var(--hgps-accent);
        box-shadow: 0 0 0 0.1875rem var(--hgps-accent-ring);
    }

    .search custom-icon {
        color: var(--hgps-text-subtle);
    }

    .search input {
        flex: 1;
        min-width: 0;
        height: 2.75rem;
        border: none;
        outline: none;
        background: transparent;
        color: var(--hgps-text);
        font: inherit;
        font-size: 0.95rem;
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

    .hint {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-2);
        margin: 0;
        padding: 0 var(--hgps-size-1);
        font-size: 0.82rem;
        color: var(--hgps-text-subtle);
    }

    .hint.error {
        color: var(--hgps-danger-text);
    }

    /* Search results: each row is a button that selects the user */
    .results li {
        padding: 0;
        background: none;
        border: none;
    }

    .result {
        all: unset;
        box-sizing: border-box;
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--hgps-size-3);
        padding: var(--hgps-size-2) var(--hgps-size-3);
        background-color: var(--hgps-surface-2);
        border: thin solid transparent;
        border-radius: var(--hgps-size-3);
        cursor: pointer;
        transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease;
    }

    .result:hover {
        border-color: var(--hgps-accent);
        background-color: color-mix(in srgb, var(--hgps-accent) 6%, var(--hgps-surface-2));
    }

    .result:active {
        transform: scale(0.99);
    }

    .result:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: 0.125rem;
    }

    .result .chevron {
        color: var(--hgps-text-faint);
    }

    mark {
        background: none;
        color: var(--hgps-accent);
        font-weight: 700;
    }

    .badge {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        padding: 0.125rem var(--hgps-size-2);
        border-radius: var(--hgps-size-10);
        font-size: 0.7rem;
        font-weight: 700;
        white-space: nowrap;
        background-color: var(--hgps-surface-3);
        color: var(--hgps-text-muted);
    }

    .badge.friend {
        background-color: color-mix(in srgb, var(--hgps-accent) 22%, transparent);
        color: var(--hgps-accent);
    }

    .badge.incoming {
        background-color: var(--hgps-accent);
        color: var(--hgps-accent-contrast);
    }

    /* Selected user, with the "send request" action */
    .selected {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-3);
        padding: var(--hgps-size-4);
        background-color: color-mix(in srgb, var(--hgps-accent) 7%, var(--hgps-surface-2));
        border: thin solid color-mix(in srgb, var(--hgps-accent) 45%, transparent);
        border-radius: var(--hgps-size-3);
        animation: pop-in 0.18s ease-out;
    }

    .selected-head {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-3);
    }

    .selected .avatar {
        width: 3.25rem;
        height: 3.25rem;
        font-size: 1.05rem;
    }

    .selected .name {
        font-size: 1.05rem;
    }

    .send-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--hgps-size-2);
        height: 2.75rem;
        border: none;
        border-radius: var(--hgps-size-2);
        background-color: var(--hgps-accent);
        color: var(--hgps-accent-contrast);
        font: inherit;
        font-size: 0.92rem;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.15s ease, opacity 0.15s ease;
    }

    .send-btn:hover:not(:disabled) {
        background-color: var(--hgps-accent-hover);
    }

    .send-btn:disabled {
        opacity: 0.6;
        cursor: progress;
    }

    .send-btn .spinner {
        border-color: color-mix(in srgb, var(--hgps-accent-contrast) 30%, transparent);
        border-top-color: var(--hgps-accent-contrast);
    }

    .status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--hgps-size-2);
        min-height: 2.75rem;
        padding: 0 var(--hgps-size-3);
        border-radius: var(--hgps-size-2);
        background-color: var(--hgps-surface-3);
        color: var(--hgps-text-muted);
        font-size: 0.9rem;
        font-weight: 600;
        text-align: center;
    }

    .status.success {
        background-color: color-mix(in srgb, var(--hgps-accent) 18%, transparent);
        color: var(--hgps-accent);
        animation: pop-in 0.2s ease-out;
    }

    /* ---- Lists ---- */
    .list-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .section {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
    }

    .count {
        min-width: 1.25rem;
        padding: 0 var(--hgps-size-2);
        border-radius: var(--hgps-size-10);
        background-color: var(--hgps-surface-3);
        color: var(--hgps-text-muted);
        font-size: 0.72rem;
        font-weight: 700;
        line-height: 1.25rem;
        text-align: center;
    }

    .count.highlight {
        background-color: var(--hgps-accent);
        color: var(--hgps-accent-contrast);
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
    }

    li {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-3);
        padding: var(--hgps-size-2) var(--hgps-size-2) var(--hgps-size-2) var(--hgps-size-3);
        background-color: var(--hgps-surface-2);
        border: thin solid transparent;
        border-radius: var(--hgps-size-3);
        transition: border-color 0.15s ease, background-color 0.15s ease;
    }

    li:hover {
        border-color: var(--hgps-border-strong);
    }

    li.outgoing {
        border-style: dashed;
        border-color: var(--hgps-border-strong);
    }

    li.request {
        background-color: color-mix(in srgb, var(--hgps-accent) 8%, var(--hgps-surface-2));
        border-color: color-mix(in srgb, var(--hgps-accent) 35%, transparent);
    }

    /* Just sent / just accepted: short highlight */
    li.new {
        animation: flash 1.6s ease-out;
    }

    /* Friend row asking "remove?" */
    li.confirming {
        border-color: color-mix(in srgb, var(--hgps-danger) 55%, transparent);
        background-color: color-mix(in srgb, var(--hgps-danger) 8%, var(--hgps-surface-2));
    }

    li.busy {
        opacity: 0.6;
    }

    .avatar {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background-color: color-mix(in srgb, var(--avatar-color) 22%, transparent);
        border: 0.125rem solid var(--avatar-color);
        color: var(--hgps-text-strong);
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.03rem;
    }

    .info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
    }

    .name {
        font-weight: 600;
        color: var(--hgps-text-strong);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .meta {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-1);
        font-size: 0.78rem;
        color: var(--hgps-text-subtle);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .row-actions {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-1);
    }

    .icon-btn {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: var(--hgps-size-2);
        color: var(--hgps-text-muted);
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease;
    }

    .icon-btn:hover {
        background-color: var(--hgps-surface-3);
    }

    .icon-btn:disabled {
        cursor: progress;
    }

    .icon-btn.view:hover {
        background-color: color-mix(in srgb, var(--hgps-accent) 18%, transparent);
        color: var(--hgps-accent);
    }

    .icon-btn.accept {
        background-color: var(--hgps-accent);
        color: var(--hgps-accent-contrast);
    }

    .icon-btn.accept:hover {
        background-color: var(--hgps-accent-hover);
    }

    .icon-btn.decline {
        background-color: var(--hgps-surface-3);
    }

    .icon-btn.decline:hover,
    .icon-btn.remove:hover,
    .icon-btn.cancel:hover {
        background-color: color-mix(in srgb, var(--hgps-danger) 18%, transparent);
        color: var(--hgps-danger-text);
    }

    /* Small text buttons of the "remove?" confirmation */
    .text-btn {
        all: unset;
        display: inline-flex;
        align-items: center;
        height: 2rem;
        padding: 0 var(--hgps-size-3);
        border-radius: var(--hgps-size-2);
        font-size: 0.82rem;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        transition: background-color 0.15s ease;
    }

    .text-btn.danger {
        background-color: var(--hgps-danger);
        color: #fff;
    }

    .text-btn.danger:hover {
        background-color: var(--hgps-danger-hover);
    }

    .text-btn.neutral {
        background-color: var(--hgps-surface-3);
        color: var(--hgps-text);
    }

    .icon-btn:focus-visible,
    .text-btn:focus-visible,
    .send-btn:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: 0.125rem;
    }

    .empty {
        border: thin dashed var(--hgps-border-strong);
        border-radius: var(--hgps-size-3);
    }

    .empty.compact {
        padding: var(--hgps-size-4);
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @keyframes pop-in {
        from { opacity: 0; transform: translateY(-0.25rem); }
        to { opacity: 1; transform: none; }
    }

    @keyframes flash {
        from { background-color: color-mix(in srgb, var(--hgps-accent) 25%, var(--hgps-surface-2)); }
        to { background-color: var(--hgps-surface-2); }
    }

    @media (prefers-reduced-motion: reduce) {
        .selected, .status.success, li.new { animation: none; }
        .spinner { animation-duration: 2s; }
    }

    @media (max-width: 26rem) {
        .confirm-text { white-space: normal; }
    }
`;
