// A user preference picked from a fixed list of options, e.g. the color theme
// or the map style. Each option is an object with at least an `id`.
//   - the choice is remembered in localStorage (works logged out too);
//   - listeners are told about every change (onChange);
//   - PreferenceController re-renders a Lit component after every change.
// Saving the choice to the user's account is done by userSettingsSync.js.

export class Preference {

    /**
     * @param {object}   config
     * @param {string}   config.storageKey  localStorage key
     * @param {object[]} config.options     the possible values, each with an `id`
     * @param {string}   config.defaultId   used when nothing (valid) is stored
     */
    constructor({storageKey, options, defaultId}) {
        this.storageKey = storageKey;
        this.options = options;
        this.events = new EventTarget();
        this.current = this.find(this._readStored()) ?? this.find(defaultId);
    }

    find(id) {
        return this.options.find(option => option.id === id);
    }

    isKnown(id) {
        return this.find(id) !== undefined;
    }

    /** Selects the option with this id. Unknown ids and the current one are ignored. */
    set(id) {
        const option = this.find(id);
        if (!option || option === this.current) return;
        this.current = option;
        this._store(option.id);
        this.events.dispatchEvent(new CustomEvent('change', {detail: option}));
    }

    /**
     * Calls listener(option) after every change.
     * @returns {function} removes the listener
     */
    onChange(listener) {
        const handler = event => listener(event.detail);
        this.events.addEventListener('change', handler);
        return () => this.events.removeEventListener('change', handler);
    }

    _readStored() {
        try {
            return localStorage.getItem(this.storageKey);
        } catch {
            return null;
        }
    }

    _store(id) {
        try {
            localStorage.setItem(this.storageKey, id);
        } catch {
            // storage unavailable: the choice just won't be remembered
        }
    }
}

/**
 * Lit reactive controller: re-renders its host whenever the preference changes.
 * Usage in a component constructor: `new PreferenceController(this, somePreference);`
 */
export class PreferenceController {
    constructor(host, preference) {
        this.host = host;
        this.preference = preference;
        host.addController(this);
    }

    hostConnected() {
        this._unsubscribe = this.preference.onChange(() => this.host.requestUpdate());
    }

    hostDisconnected() {
        this._unsubscribe?.();
    }
}
