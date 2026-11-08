import i18next from 'i18next';

import en from '../../i18n/en.i18n.json';
import fr from '../../i18n/fr.i18n.json';
import de from '../../i18n/de.i18n.json';
import it from '../../i18n/it.i18n.json';

const STORAGE_KEY = 'language';

export const SUPPORTED_LANGUAGES = [
    {code: 'en', label: 'EN'},
    {code: 'fr', label: 'FR'},
    {code: 'de', label: 'DE'},
    {code: 'it', label: 'IT'},
];

const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);

function readStoredLanguage() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function detectLanguage() {
    const stored = readStoredLanguage();
    if (supportedCodes.includes(stored)) return stored;
    const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return supportedCodes.includes(browser) ? browser : 'en';
}

// Translations are bundled, so init runs synchronously and t() is usable
// as soon as this module is imported.
i18next.init({
    lng: detectLanguage(),
    fallbackLng: 'en',
    supportedLngs: supportedCodes,
    initAsync: false,
    interpolation: {escapeValue: false}, // Lit already escapes rendered text
    resources: {
        en: {translation: en},
        fr: {translation: fr},
        de: {translation: de},
        it: {translation: it},
    },
});

document.documentElement.lang = i18next.language;

i18next.on('languageChanged', lng => {
    document.documentElement.lang = lng;
    try {
        localStorage.setItem(STORAGE_KEY, lng);
    } catch {
        // storage unavailable: the choice just won't be remembered
    }
});

export const t = (key, options) => i18next.t(key, options);

export const getLanguage = () => i18next.resolvedLanguage ?? i18next.language;

export const setLanguage = lng => i18next.changeLanguage(lng);

/**
 * Lit reactive controller: re-renders its host whenever the language changes.
 * Usage in a component constructor: `new I18nController(this);`
 */
export class I18nController {
    constructor(host) {
        this.host = host;
        this._onChange = () => this.host.requestUpdate();
        host.addController(this);
    }

    hostConnected() {
        i18next.on('languageChanged', this._onChange);
    }

    hostDisconnected() {
        i18next.off('languageChanged', this._onChange);
    }
}

export default i18next;
