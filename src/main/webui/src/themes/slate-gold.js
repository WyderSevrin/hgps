// Slate & Gold: the original dark theme, and the default.
// It defines every color token of the app; other themes extend it and only
// override what differs (see themes/index.js).

export default {
    id: 'slate-gold',
    colorScheme: 'dark',
    tokens: {
        /* ---- Brand: gold ------------------------------------------------ */
        '--hgps-gold': '#d4af37',
        '--hgps-gold-bright': '#f2c94c',
        '--hgps-gold-deep': '#b8860b',
        '--hgps-gold-pale': '#ffe27a',

        /* ---- Slate / river neutrals (header gradient stops) ------------- */
        '--hgps-slate-deep': '#1c2b33',
        '--hgps-slate': '#24363f',
        '--hgps-slate-light': '#2e3f47',

        /* ---- Surfaces (dark ramp, tinted toward the header slate) ------- */
        '--hgps-bg': '#16232a', /* app / page background, deepest */
        '--hgps-surface': '#1f2e35', /* cards, sidebar, dialogs, drawer */
        '--hgps-surface-2': '#26363f', /* card headers, chips */
        '--hgps-surface-3': '#2f434d', /* raised buttons, row index */
        '--hgps-surface-hover': '#38505c', /* hover state */

        /* ---- Borders ---------------------------------------------------- */
        '--hgps-border': '#33474f',
        '--hgps-border-strong': '#43606b',

        /* ---- Text ------------------------------------------------------- */
        '--hgps-text': '#eae4d6', /* warm off-white body text */
        '--hgps-text-strong': '#ffffff',
        '--hgps-text-muted': '#a7b3b8',
        '--hgps-text-subtle': '#7d8a90',
        '--hgps-text-faint': '#566368',
        '--hgps-title': 'var(--hgps-gold-pale)', /* big display titles (home hero) */

        /* ---- Accent (interactive highlights) = brand gold --------------- */
        '--hgps-accent': 'var(--hgps-gold)',
        '--hgps-accent-hover': 'var(--hgps-gold-bright)',
        '--hgps-accent-contrast': '#1a1a1a', /* text on a gold fill */
        '--hgps-accent-ring': 'rgba(212, 175, 55, 0.30)', /* focus ring */

        /* ---- Header ----------------------------------------------------- */
        '--hgps-header-bg': 'linear-gradient(120deg, #1c2b33 0%, #24363f 45%, #3a3220 100%)',
        '--hgps-header-border': 'var(--hgps-gold)',
        '--hgps-on-header': '#f5e9c8', /* cream text on the header */
        '--hgps-on-header-muted': '#cbb98c',
        '--hgps-header-control': 'rgba(20, 30, 35, 0.65)', /* language selector */
        '--hgps-header-control-hover': 'rgba(40, 55, 62, 0.85)',

        /* ---- Danger ----------------------------------------------------- */
        '--hgps-danger': '#e53935',
        '--hgps-danger-hover': '#f4433a',
        '--hgps-danger-text': '#ef5350',

        /* ---- Utility (overlays / shadows) ------------------------------- */
        '--hgps-overlay': 'rgba(0, 0, 0, 0.55)',
        '--hgps-shadow': 'rgba(0, 0, 0, 0.5)',
        '--hgps-shadow-soft': 'rgba(0, 0, 0, 0.4)',

        /* ---- Map (functional state colors; read from JS via getComputedStyle) */
        '--hgps-map-marker': '#2563eb',

        /* ---- Gold presence palette (area color on the map) -------------
           0 = not determined yet, then a cold -> hot scale from traces (1)
           up to a lot of gold (5). Read from JS via Area.goldPresenceColorVar(). */
        '--hgps-gold-level-0': '#7d8a91',
        '--hgps-gold-level-1': '#4a90d9',
        '--hgps-gold-level-2': '#26a69a',
        '--hgps-gold-level-3': '#7cb342',
        '--hgps-gold-level-4': '#f2b705',
        '--hgps-gold-level-5': '#e65100',
    },
};
