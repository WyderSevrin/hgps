// slider-component.styles.js
import { css } from 'lit';

export const sliderComponentStyles = css`
    /* Override --slider-color to tint the track, thumb and value. */
    :host {
        --thumb-size: 1.125rem;
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-2);
        width: 100%;
    }

    .top {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--hgps-size-2);
    }

    .value {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--slider-color, var(--hgps-accent));
        font-variant-numeric: tabular-nums;
    }

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: var(--thumb-size);
        margin: 0;
        background: transparent;
        cursor: pointer;
    }

    input[type="range"]:focus {
        outline: none;
    }

    /* Track: filled part up to the thumb uses the accent color. */
    input[type="range"]::-webkit-slider-runnable-track {
        height: 0.375rem;
        border-radius: 1rem;
        background: linear-gradient(to right,
            var(--slider-color, var(--hgps-accent)) 0 var(--fill),
            var(--hgps-surface-3) var(--fill) 100%);
    }

    input[type="range"]::-moz-range-track {
        height: 0.375rem;
        border-radius: 1rem;
        background: var(--hgps-surface-3);
    }

    input[type="range"]::-moz-range-progress {
        height: 0.375rem;
        border-radius: 1rem;
        background: var(--slider-color, var(--hgps-accent));
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: var(--thumb-size);
        height: var(--thumb-size);
        margin-top: calc((0.375rem - var(--thumb-size)) / 2);
        border-radius: 50%;
        background: var(--slider-color, var(--hgps-accent));
        border: 0.125rem solid var(--hgps-bg);
        box-shadow: 0 0 0 0.0625rem var(--slider-color, var(--hgps-accent));
        transition: transform 0.15s ease;
    }

    input[type="range"]::-moz-range-thumb {
        width: var(--thumb-size);
        height: var(--thumb-size);
        border-radius: 50%;
        background: var(--slider-color, var(--hgps-accent));
        border: 0.125rem solid var(--hgps-bg);
        box-shadow: 0 0 0 0.0625rem var(--slider-color, var(--hgps-accent));
    }

    input[type="range"]:hover::-webkit-slider-thumb {
        transform: scale(1.1);
    }

    input[type="range"]:focus-visible::-webkit-slider-thumb {
        box-shadow: 0 0 0 var(--hgps-size-1) var(--hgps-accent-ring);
    }

    input[type="range"]:focus-visible::-moz-range-thumb {
        box-shadow: 0 0 0 var(--hgps-size-1) var(--hgps-accent-ring);
    }

    /* Numbered scale; side padding of half a thumb lines numbers up with thumb positions. */
    .ticks {
        display: flex;
        justify-content: space-between;
        padding: 0 calc(var(--thumb-size) / 2);
        font-size: 0.7rem;
        color: var(--hgps-text-faint);
        font-variant-numeric: tabular-nums;
    }

    .ticks span {
        width: 0;
        display: flex;
        justify-content: center;
    }

    .ticks span.active {
        color: var(--slider-color, var(--hgps-accent));
        font-weight: 700;
    }
`;
