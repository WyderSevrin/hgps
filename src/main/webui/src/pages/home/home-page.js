// home-page.js
import { LitElement, html } from 'lit';
import { homePageStyles } from './home-page.styles.js';
import { I18nController, t } from '../../services/i18n/i18n.js';

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
    static styles = homePageStyles;

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
