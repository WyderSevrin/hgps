// Alpine Light: a bright theme with warm paper tones and deep gold accents.
// Only the tokens that differ from Slate & Gold are listed; the rest
// (map marker, gold presence palette) is inherited (see themes/index.js).

export default {
    id: 'alpine-light',
    colorScheme: 'light',
    tokens: {
        /* Gold is darkened so it stays readable on light backgrounds;
           "bright" is the stronger hover / emphasis shade here. */
        '--hgps-gold': '#a87a0a',
        '--hgps-gold-bright': '#8a6408',
        '--hgps-gold-deep': '#7a5806',
        '--hgps-gold-pale': '#f6e7b0',

        '--hgps-slate-deep': '#f1ead9', /* matches the header, used for badge rings */
        '--hgps-slate': '#f5f0e4',
        '--hgps-slate-light': '#faf7f0',

        '--hgps-bg': '#f3efe6',
        '--hgps-surface': '#fbf9f4',
        '--hgps-surface-2': '#f0ebe0',
        '--hgps-surface-3': '#e6dfd0',
        '--hgps-surface-hover': '#ddd4c2',

        '--hgps-border': '#ddd5c5',
        '--hgps-border-strong': '#c3b8a3',

        '--hgps-text': '#2b2a26',
        '--hgps-text-strong': '#14130f',
        '--hgps-text-muted': '#5e5a50',
        '--hgps-text-subtle': '#7a7568',
        '--hgps-text-faint': '#a39d8f',
        '--hgps-title': '#7a5806',

        '--hgps-accent-contrast': '#ffffff',
        '--hgps-accent-ring': 'rgba(168, 122, 10, 0.30)',

        '--hgps-header-bg': 'linear-gradient(120deg, #fbf9f4 0%, #f3ecdc 55%, #eadbb2 100%)',
        '--hgps-on-header': '#2b2418',
        '--hgps-on-header-muted': '#6b5c3a',
        '--hgps-header-control': 'rgba(255, 255, 255, 0.7)',
        '--hgps-header-control-hover': 'rgba(255, 255, 255, 0.95)',

        '--hgps-danger': '#c62828',
        '--hgps-danger-hover': '#b71c1c',
        '--hgps-danger-text': '#c62828',

        '--hgps-overlay': 'rgba(30, 26, 18, 0.45)',
        '--hgps-shadow': 'rgba(60, 50, 30, 0.25)',
        '--hgps-shadow-soft': 'rgba(60, 50, 30, 0.16)',
    },
};
