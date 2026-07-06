import { LitElement, html, css } from 'lit';

export class HeaderComponent extends LitElement {
    static styles = css`
        :host {
            display: block;
        }

        header {
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            padding: 6px 24px;
            /* Match the 60px slot reserved by the app layout (main margin-top) */
            height: 60px;
            /* Deep river-bed gradient: dark slate water fading to warm gold */
            background: var(--hgps-header-bg);
            color: var(--hgps-on-header);
            border-bottom: 2px solid var(--hgps-header-border);
            box-shadow: inset 0 -24px 40px -24px rgba(0, 0, 0, 0.6);
        }

        /* Decorative river / landscape art anchored to the bottom of the banner */
        .scenery {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        /* Floating gold nuggets sprinkled behind the title */
        .nugget {
            position: absolute;
            pointer-events: none;
            z-index: 1;
            opacity: 0.85;
            filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4));
        }
        .nugget-1 { top: 8px;   left: 8%;   width: 18px; transform: rotate(-12deg); }
        .nugget-2 { bottom: 6px; left: 20%; width: 13px; transform: rotate(18deg); opacity: 0.6; }
        .nugget-3 { top: 9px;   right: 26%; width: 15px; transform: rotate(24deg); opacity: 0.7; }
        .nugget-4 { bottom: 7px; right: 13%; width: 16px; transform: rotate(-8deg); }

        .brand {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            gap: 12px;
            text-align: center;
        }

        .pan {
            width: 36px;
            height: 36px;
            flex: 0 0 auto;
            filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.5));
        }

        .titles {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            line-height: 1.1;
        }

        .title {
            margin: 0;
            font-size: clamp(18px, 3vw, 26px);
            font-weight: 800;
            letter-spacing: 0.5px;
            /* Molten-gold text */
            background: linear-gradient(180deg, var(--hgps-gold-pale) 0%, var(--hgps-gold-bright) 45%, var(--hgps-gold-deep) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
        }

        .subtitle {
            margin: 2px 0 0;
            font-size: clamp(9px, 1.2vw, 12px);
            font-weight: 500;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: var(--hgps-on-header-muted);
        }

        /* Language selector pinned to the far right */
        .lang {
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            z-index: 3;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .lang svg {
            width: 18px;
            height: 18px;
            color: var(--hgps-gold);
            opacity: 0.9;
        }

        .lang select {
            appearance: none;
            -webkit-appearance: none;
            background: var(--hgps-header-control);
            color: var(--hgps-on-header);
            border: 1px solid var(--hgps-gold);
            border-radius: 6px;
            padding: 5px 28px 5px 10px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.25s ease, border-color 0.25s ease;
            /* Custom golden chevron */
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23d4af37' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 14px;
        }
        .lang select:hover {
            background-color: var(--hgps-header-control-hover);
            border-color: var(--hgps-gold-bright);
        }
        .lang select:focus {
            outline: none;
            border-color: var(--hgps-gold-bright);
            box-shadow: 0 0 0 2px var(--hgps-accent-ring);
        }
        .lang option {
            background: var(--hgps-slate);
            color: var(--hgps-on-header);
        }

        @media (max-width: 520px) {
            .brand { gap: 8px; }
            .pan { width: 34px; height: 34px; }
            .lang { right: 12px; }
        }
    `;

    static properties = {
        language: { type: String },
    };

    constructor() {
        super();
        // Design-only: default language. No i18n logic wired up yet.
        this.language = 'en';
    }

    onLanguageChange(event) {
        // Placeholder — captures the selection for future i18n wiring.
        this.language = event.target.value;
    }

    render() {
        return html`
            <header>
                <!-- Background scenery: mountains, flowing river and a glinting sun -->
                <svg
                    class="scenery"
                    viewBox="0 0 1200 200"
                    preserveAspectRatio="xMidYMax slice"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="riverGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="#7ec8e3" stop-opacity="0.55" />
                            <stop offset="100%" stop-color="#d4af37" stop-opacity="0.35" />
                        </linearGradient>
                        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#fff2c2" stop-opacity="0.9" />
                            <stop offset="100%" stop-color="#f2c94c" stop-opacity="0" />
                        </radialGradient>
                    </defs>

                    <!-- Soft sun glow -->
                    <circle cx="980" cy="46" r="70" fill="url(#sunGrad)" />

                    <!-- Far mountain range -->
                    <path
                        d="M0 130 L140 70 L260 120 L400 55 L520 115 L640 60 L780 118 L920 72 L1060 120 L1200 80 L1200 200 L0 200 Z"
                        fill="#2e3f47"
                        opacity="0.7"
                    />
                    <!-- Near mountain range -->
                    <path
                        d="M0 160 L180 100 L340 150 L520 95 L700 155 L880 105 L1060 155 L1200 120 L1200 200 L0 200 Z"
                        fill="#26343b"
                    />

                    <!-- Winding river carving through the foreground -->
                    <path
                        d="M-20 200 C 200 150, 300 190, 500 165 C 720 138, 820 185, 1040 150 C 1140 135, 1180 160, 1220 150 L1220 200 Z"
                        fill="url(#riverGrad)"
                    />
                    <!-- River highlight ripples -->
                    <path
                        d="M120 188 C 320 165, 420 185, 620 168"
                        fill="none"
                        stroke="#eaf6fb"
                        stroke-width="2"
                        stroke-linecap="round"
                        opacity="0.35"
                    />
                    <path
                        d="M640 182 C 820 165, 940 186, 1120 166"
                        fill="none"
                        stroke="#eaf6fb"
                        stroke-width="2"
                        stroke-linecap="round"
                        opacity="0.25"
                    />
                </svg>

                <!-- Scattered gold nuggets -->
                ${this.renderNugget('nugget nugget-1')}
                ${this.renderNugget('nugget nugget-2')}
                ${this.renderNugget('nugget nugget-3')}
                ${this.renderNugget('nugget nugget-4')}

                <!-- Brand: gold pan icon + title -->
                <div class="brand">
                    <svg
                        class="pan"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="panGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="#8a5a2b" />
                                <stop offset="100%" stop-color="#5a3a1a" />
                            </linearGradient>
                        </defs>
                        <!-- Pan bowl -->
                        <ellipse cx="50" cy="52" rx="42" ry="24" fill="url(#panGrad)" />
                        <ellipse cx="50" cy="48" rx="42" ry="24" fill="#b07a3c" />
                        <ellipse cx="50" cy="48" rx="30" ry="16" fill="#3a2a18" />
                        <!-- Water shimmer -->
                        <ellipse cx="50" cy="47" rx="26" ry="13" fill="#4a6b74" opacity="0.7" />
                        <!-- Gold flakes settled in the pan -->
                        <circle cx="42" cy="50" r="4" fill="#f2c94c" />
                        <circle cx="55" cy="53" r="3" fill="#ffd95e" />
                        <circle cx="60" cy="46" r="2.5" fill="#e0a92b" />
                        <circle cx="47" cy="45" r="2" fill="#ffe27a" />
                    </svg>

                    <div class="titles">
                        <h1 class="title">Hobby Gold Prospecting</h1>
                        <p class="subtitle">Switzerland</p>
                    </div>
                </div>

                <!-- Far-right language selector (design only) -->
                <div class="lang">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         aria-hidden="true">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M2 12h20" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <select
                        aria-label="Select language"
                        .value="${this.language}"
                        @change="${this.onLanguageChange}"
                    >
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="ger">GER</option>
                        <option value="it">IT</option>
                    </select>
                </div>
            </header>
        `;
    }

    renderNugget(className) {
        return html`
            <svg
                class="${className}"
                viewBox="0 0 40 32"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="nuggetGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#ffe27a" />
                        <stop offset="55%" stop-color="#f2c94c" />
                        <stop offset="100%" stop-color="#b8860b" />
                    </linearGradient>
                </defs>
                <path
                    d="M6 18 C 2 10, 10 4, 16 6 C 20 2, 30 4, 32 10 C 40 12, 38 22, 32 26 C 28 32, 16 32, 10 28 C 4 26, 4 22, 6 18 Z"
                    fill="url(#nuggetGrad)"
                    stroke="#8a6508"
                    stroke-width="1"
                />
                <!-- Facet highlights -->
                <path d="M14 12 L20 10 L18 16 Z" fill="#fff6d0" opacity="0.7" />
                <path d="M24 14 L30 16 L26 20 Z" fill="#fff6d0" opacity="0.4" />
            </svg>
        `;
    }
}

customElements.define('header-component', HeaderComponent);
