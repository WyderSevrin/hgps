import { THEMES, DEFAULT_THEME_ID } from '../../themes/index.js';
import { Preference, PreferenceController } from '../preferences/preference.js';

// Color theme service: applies a theme's --hgps-* tokens as inline custom
// properties on <html>, so they reach every component (custom properties
// inherit through shadow DOM). The choice is remembered in localStorage
// and saved to the user's settings (see preferences/userSettingsSync.js).

export { THEMES };

export const themePreference = new Preference({
    storageKey: 'theme',
    options: THEMES,
    defaultId: DEFAULT_THEME_ID,
});

/**
 * Write a theme's tokens onto an element. Used for the whole app (<html>) and
 * for theme previews, which are just elements carrying another theme's tokens.
 */
export function applyThemeTo(element, theme) {
    for (const [name, value] of Object.entries(theme.tokens)) {
        element.style.setProperty(name, value);
    }
    element.style.colorScheme = theme.colorScheme;
}

function applyToApp(theme) {
    applyThemeTo(document.documentElement, theme);
    document.documentElement.dataset.theme = theme.id;
}

// Applied as soon as this module is imported, before the app renders,
// so there is no flash of the default theme. Registered first, so the
// theme is applied before any other listener runs.
applyToApp(themePreference.current);
themePreference.onChange(applyToApp);

export const getTheme = () => themePreference.current;

export const setTheme = id => themePreference.set(id);

/**
 * Calls listener(theme) after every theme change. Returns a function that
 * removes the listener.
 */
export const onThemeChange = listener => themePreference.onChange(listener);

/**
 * Lit reactive controller: re-renders its host whenever the theme changes.
 * Only needed by components that read colors from JS (e.g. the map) or show
 * the current theme; plain CSS using var(--hgps-*) updates by itself.
 * Usage in a component constructor: `new ThemeController(this);`
 */
export class ThemeController extends PreferenceController {
    constructor(host) {
        super(host, themePreference);
    }
}
