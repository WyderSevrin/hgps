import {auth} from '../auth/authService.js';
import {UserService} from '../api/userService.js';
import {themePreference} from '../theme/theme.js';
import {mapStylePreference} from '../mapStyle/mapStyle.js';

// Keeps preferences in sync with the logged-in user's settings
// (PATCH /api/me/settings):
//   - on login, the saved value wins over the one stored in the browser;
//     a user with nothing saved yet gets the current value saved;
//   - while logged in, every change is saved.
// Logged out, each preference keeps working with localStorage alone.

/**
 * @param {Preference} preference
 * @param {string} field  name of the setting in the user (auth.user) and in the PATCH body
 */
function syncWithUserSettings(preference, field) {

    async function save(id) {
        if (!auth.authenticated || auth.user[field] === id) return;
        try {
            const user = await UserService.updateSettings({[field]: id});
            auth.user[field] = user[field];
        } catch (e) {
            // Still applied and stored in the browser, just not on the account
            console.warn(`[settings] "${field}" could not be saved to the user settings`, e);
        }
    }

    auth.addEventListener('auth-changed', () => {
        if (!auth.authenticated) return;
        const saved = auth.user[field];
        if (preference.isKnown(saved)) {
            preference.set(saved); // no-op if already active; save() then skips (same id)
        } else {
            save(preference.current.id);
        }
    });

    preference.onChange(option => save(option.id));
}

syncWithUserSettings(themePreference, 'theme');
syncWithUserSettings(mapStylePreference, 'mapStyle');
