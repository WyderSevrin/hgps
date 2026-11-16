// home-page.styles.js
import { css } from 'lit';

export const homePageStyles = css`
    :host {
        display: block;
        position: relative;
        height: 100%;
        overflow: hidden;
        background: var(--hgps-bg);
    }

    /* Background layers stay put; only .scroller scrolls over them. */
    .backdrop,
    .shade {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .backdrop svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    /* Tones the bright picture toward the theme background so the title and cards stay readable. */
    .shade {
        background: linear-gradient(180deg,
            color-mix(in srgb, var(--hgps-bg) 55%, transparent) 0%,
            color-mix(in srgb, var(--hgps-bg) 35%, transparent) 40%,
            color-mix(in srgb, var(--hgps-bg) 70%, transparent) 100%);
    }

    .scroller {
        position: relative;
        height: 100%;
        overflow-y: auto;
    }

    .page {
        box-sizing: border-box;
        max-width: 68rem;
        margin: 0 auto;
        padding: var(--hgps-size-10) var(--hgps-size-8) calc(var(--hgps-size-10) * 2);
    }

    /* ---- Hero ------------------------------------------------------ */
    .hero {
        text-align: center;
        margin-bottom: calc(var(--hgps-size-10) * 1.5);
        text-shadow: 0 2px 12px var(--hgps-bg), 0 0 4px var(--hgps-bg); /* halo in the background color */
    }

    .hero h1 {
        margin: 0 0 var(--hgps-size-3);
        color: var(--hgps-title);
        font-size: clamp(1.75rem, 4vw, 2.75rem);
        line-height: 1.15;
    }

    .hero p {
        margin: 0 auto;
        max-width: 36rem;
        color: var(--hgps-text-strong);
        font-size: var(--hgps-font-size-3);
        line-height: 1.5;
    }

    /* ---- Cards ----------------------------------------------------- */
    .cards {
        display: flex;
        flex-direction: column;
        gap: var(--hgps-size-8);
    }

    .card {
        box-sizing: border-box;
        width: 46%;
        padding: var(--hgps-size-6);
        border: 1px solid var(--hgps-border);
        border-top: 3px solid var(--hgps-accent);
        border-radius: var(--hgps-size-3);
        background: color-mix(in srgb, var(--hgps-surface) 88%, transparent); /* slightly see-through */
        backdrop-filter: blur(6px);
        box-shadow: 0 0.5rem 1.5rem var(--hgps-shadow);
    }

    .card:nth-child(odd) {
        align-self: flex-start;
    }

    .card:nth-child(even) {
        align-self: flex-end;
    }

    .card-head {
        display: flex;
        align-items: center;
        gap: var(--hgps-size-3);
        margin-bottom: var(--hgps-size-3);
    }

    .card-number {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: var(--hgps-size-10);
        height: var(--hgps-size-10);
        border-radius: 50%;
        background: var(--hgps-surface-2);
        color: var(--hgps-accent);
    }

    .card h2 {
        margin: 0;
        color: var(--hgps-text-strong);
        font-size: 1.3rem;
        line-height: 1.25;
    }

    .card p {
        margin: 0;
        line-height: 1.6;
    }

    .card a {
        display: inline-flex;
        align-items: center;
        gap: var(--hgps-size-1);
        margin-top: var(--hgps-size-4);
        color: var(--hgps-accent);
        font-weight: 600;
        text-decoration: none;
    }

    .card a:hover,
    .card a:focus-visible {
        color: var(--hgps-accent-hover);
        text-decoration: underline;
    }

    .card a:focus-visible {
        outline: 0.125rem solid var(--hgps-accent);
        outline-offset: 0.125rem;
        border-radius: var(--hgps-size-1);
    }

    /* ---- Narrow screens: one column -------------------------------- */
    @media (max-width: 720px) {
        .page {
            padding: var(--hgps-size-8) var(--hgps-size-4) var(--hgps-size-10);
        }

        .card {
            width: 100%;
        }
    }
`;
