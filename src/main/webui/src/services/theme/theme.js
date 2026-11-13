import { THEMES, DEFAULT_THEME_ID } from '../../themes/index.js';

// Color theme service: applies a theme's --hgps-* tokens as inline custom
// properties on <html>, so they reach every component (custom properties
// inherit through shadow DOM). The choice is remembered in localStorage.

const STORAGE_KEY = 'theme';
const CHANGE_EVENT = 'theme-changed';
const events = new EventTarget();

export { THEMES };

const findTheme = id => THEMES.find(theme => theme.id === id);

function readStoredTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

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

let current = findTheme(readStoredTheme()) ?? findTheme(DEFAULT_THEME_ID);

// Applied as soon as this module is imported, before the app renders,
// so there is no flash of the default theme.
applyThemeTo(document.documentElement, current);
document.documentElement.dataset.theme = current.id;

export const getTheme = () => current;

export function setTheme(id) {
    const theme = findTheme(id);
    if (!theme || theme === current) return;
    current = theme;
    applyThemeTo(document.documentElement, theme);
    document.documentElement.dataset.theme = theme.id;
    try {
        localStorage.setItem(STORAGE_KEY, theme.id);
    } catch {
        // storage unavailable: the choice just won't be remembered
    }
    events.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: theme }));
}

/**
 * Lit reactive controller: re-renders its host whenever the theme changes.
 * Only needed by components that read colors from JS (e.g. the map) or show
 * the current theme; plain CSS using var(--hgps-*) updates by itself.
 * Usage in a component constructor: `new ThemeController(this);`
 */
export class ThemeController {
    constructor(host) {
        this.host = host;
        this._onChange = () => this.host.requestUpdate();
        host.addController(this);
    }

    hostConnected() {
        events.addEventListener(CHANGE_EVENT, this._onChange);
    }

    hostDisconnected() {
        events.removeEventListener(CHANGE_EVENT, this._onChange);
    }
}
