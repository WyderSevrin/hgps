// home-page.js
import { LitElement, html, css } from 'lit';
import { I18nController, t } from '../services/i18n/i18n.js';

// Landing page: a column of cards zig-zagging left / right over an alpine
// river background.

const CARDS = [
    { key: 'prospecting', icon: 'diamond' },
    { key: 'problem', icon: 'travel_explore' },
    { key: 'map', icon: 'map', href: '#map' },
    { key: 'guide', icon: 'menu_book', href: '#guide' },
    { key: 'legal', icon: 'gavel' },
];

export class HomePage extends LitElement {
    static styles = css`
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

    constructor() {
        super();
        this.i18n = new I18nController(this);
    }

    // The picture lives inside an SVG so the oil-paint filter is referenced
    // from the same SVG (CSS url(#id) filters are unreliable in shadow DOM).
    // Filter steps: dilate merges details into dabs of paint, the discrete
    // transfer flattens the colors into fewer shades, and the noise
    // displacement makes the edges wobble like brush strokes.
    _renderBackdrop() {
        // Posterize into STEPS shades per channel. Each band maps to the middle
        // of its input range (not its bottom), so the picture keeps its
        // brightness and dark areas don't get crushed into black patches.
        const STEPS = 40;
        const levels = Array.from({ length: STEPS }, (_, k) => ((k + 0.5) / STEPS).toFixed(3)).join(' ');
        return html`
            <div class="backdrop" aria-hidden="true">
                <svg>
                    <filter id="oil-paint" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
                        <feMorphology operator="dilate" radius="1.5" result="dabs"></feMorphology>
                        <feGaussianBlur in="dabs" stdDeviation="1.5" result="soft"></feGaussianBlur>
                        <feComponentTransfer in="soft" result="flat">
                            <feFuncR type="discrete" tableValues=${levels}></feFuncR>
                            <feFuncG type="discrete" tableValues=${levels}></feFuncG>
                            <feFuncB type="discrete" tableValues=${levels}></feFuncB>
                        </feComponentTransfer>
                        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="noise"></feTurbulence>
                        <feDisplacementMap in="flat" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
                    </filter>
                    <!-- slightly oversized so the displaced edges never show the page behind -->
                    <image
                        href="/quinoa/bk.jpg"
                        x="-2%" y="-2%" width="104%" height="104%"
                        preserveAspectRatio="xMidYMid slice"
                        filter="url(#oil-paint)"
                    ></image>
                </svg>
            </div>
            <div class="shade"></div>
        `;
    }

    render() {
        return html`
            ${this._renderBackdrop()}
            <div class="scroller">
            <div class="page">
                <section class="hero">
                    <h1>${t('home.hero.title')}</h1>
                    <p>${t('home.hero.subtitle')}</p>
                </section>

                <div class="cards">
                    ${CARDS.map(card => html`
                        <article class="card">
                            <div class="card-head">
                                <span class="card-number" aria-hidden="true">
                                    <custom-icon label=${card.icon}></custom-icon>
                                </span>
                                <h2>${t(`home.cards.${card.key}.title`)}</h2>
                            </div>
                            <p>${t(`home.cards.${card.key}.text`)}</p>
                            ${card.href ? html`
                                <a href=${card.href}>
                                    ${t(`home.cards.${card.key}.cta`)}
                                    <custom-icon label="arrow_forward"></custom-icon>
                                </a>
                            ` : ''}
                        </article>
                    `)}
                </div>
            </div>
            </div>
        `;
    }
}

customElements.define('home-page', HomePage);
