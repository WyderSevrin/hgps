// Registry of the color themes.
//
// Adding a theme:
//   1. Create src/themes/<id>.js exporting { id, colorScheme, tokens }.
//      `tokens` only needs the --hgps-* colors that differ from the base theme.
//   2. Import it below and add it to THEMES (the order is the order shown in
//      User options > Appearance).
//   3. Add its name and description to the i18n files under
//      userOptions.appearance.themes.<id>.{name,description}.

import slateGold from './slate-gold.js';
import alpineLight from './alpine-light.js';

/** Theme every other theme extends; it defines all the color tokens. */
const BASE = slateGold;

const withBase = theme => ({
    ...theme,
    tokens: theme === BASE ? theme.tokens : { ...BASE.tokens, ...theme.tokens },
});

export const THEMES = [slateGold, alpineLight].map(withBase);

export const DEFAULT_THEME_ID = BASE.id;
