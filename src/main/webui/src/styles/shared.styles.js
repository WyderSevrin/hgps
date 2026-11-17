// shared.styles.js
// Rules used by several components. Components render in shadow DOM, where the
// global style.css does not apply (only the --hgps-* tokens and inherited
// properties get through), so shared rules live here and each component adds
// the ones it needs before its own styles:
//     static styles = [fieldLabelStyles, myComponentStyles];
import { css } from 'lit';

// Small uppercase label above a form field
export const fieldLabelStyles = css`
    .field-label {
        font-size: 0.72rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03125rem;
        color: var(--hgps-text-subtle);
    }
`;

// Dialog buttons: <button class="btn btn-cancel">; color variants stay in the component
export const buttonStyles = css`
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.5625rem var(--hgps-size-4);
        border: none;
        border-radius: 0.375rem;
        font-size: 0.88rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .btn custom-icon {
        font-size: 1rem;
    }

    .btn-cancel {
        background-color: var(--hgps-surface-3);
        color: var(--hgps-text);
    }

    .btn-cancel:hover {
        background-color: var(--hgps-surface-hover);
    }
`;

// "Nothing here yet" placeholder: icon above a short message
export const emptyStateStyles = css`
    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--hgps-size-2);
        padding: var(--hgps-size-6) var(--hgps-size-4);
        color: var(--hgps-text-muted);
        text-align: center;
    }

    .empty custom-icon {
        color: var(--hgps-text-faint);
    }
`;

// On/off switch: a native checkbox styled as a switch, in a clickable row
//     <label class="switch">
//         <span class="switch-text">
//             <span class="switch-name">...</span>
//             <span class="switch-description">...</span>  (optional)
//         </span>
//         <input type="checkbox" role="switch">
//     </label>
export const switchStyles = css`
    .switch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--hgps-size-3);
        padding: var(--hgps-size-3);
        border: thin solid var(--hgps-border);
        border-radius: var(--hgps-size-3);
        background-color: var(--hgps-surface-2);
        cursor: pointer;
    }

    .switch-text {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-1);
        min-width: 0;
    }

    .switch-name {
        font-size: 0.86rem;
        font-weight: 600;
        color: var(--hgps-text-strong);
    }

    .switch-description {
        font-size: 0.74rem;
        line-height: 1.4;
        color: var(--hgps-text-subtle);
    }

    .switch input {
        appearance: none;
        position: relative;
        flex-shrink: 0;
        width: 2.5rem;
        height: 1.4rem;
        margin: 0;
        border-radius: 1rem;
        background-color: var(--hgps-border-strong);
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    /* The knob */
    .switch input::before {
        content: "";
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background-color: var(--hgps-surface);
        transition: transform 0.15s ease;
    }

    .switch input:checked {
        background-color: var(--hgps-accent);
    }

    .switch input:checked::before {
        transform: translateX(1.1rem);
    }

    .switch input:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: 0.125rem;
    }

    .switch input:disabled {
        opacity: 0.6;
        cursor: progress;
    }
`;

// Round gold button in the header bar
export const headerControlStyles = css`
    .header-control {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--hgps-header-control);
        border: 1px solid var(--hgps-gold);
        color: var(--hgps-gold-bright);
        cursor: pointer;
        transition: background-color 0.25s ease, border-color 0.25s ease;
    }

    .header-control:hover {
        border-color: var(--hgps-gold-bright);
    }

    .header-control:focus-visible {
        outline: none;
        border-color: var(--hgps-gold-bright);
        box-shadow: 0 0 0 2px var(--hgps-accent-ring);
    }
`;

// Bubble that drops down under a header control, with an arrow pointing at it.
// Shown when the host has the [open] attribute.
export const popoverStyles = css`
    :host {
        position: relative;
        display: inline-flex;
    }

    .popover {
        position: absolute;
        top: calc(100% + 12px);
        right: -8px;
        box-sizing: border-box;
        background-color: var(--hgps-surface);
        border: thin solid var(--hgps-border);
        border-radius: var(--hgps-size-3);
        box-shadow: 0 0.625rem 1.875rem var(--hgps-shadow);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        transform-origin: top right;
        opacity: 0;
        transform: translateY(-4px) scale(0.98);
        visibility: hidden;
        transition: opacity 0.15s ease, transform 0.15s ease, visibility 0s linear 0.15s;
    }

    :host([open]) .popover {
        opacity: 1;
        transform: none;
        visibility: visible;
        transition: opacity 0.15s ease, transform 0.15s ease;
    }

    /* Arrow pointing at the button */
    .popover::before {
        content: '';
        position: absolute;
        top: -7px;
        right: 19px;
        width: 12px;
        height: 12px;
        background-color: var(--hgps-surface);
        border-top: thin solid var(--hgps-border);
        border-left: thin solid var(--hgps-border);
        transform: rotate(45deg);
    }

    @media (prefers-reduced-motion: reduce) {
        .popover, :host([open]) .popover { transition: none; }
    }
`;
