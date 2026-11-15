import {auth} from '../auth/authService.js';
import {UserService} from '../api/userService.js';
import {THEMES, getTheme, onThemeChange, setTheme} from './theme.js';

// Keeps the color theme in sync with the logged-in user's settings
// (app_user.theme, PATCH /api/me/settings):
//   - on login, the saved theme wins over the one stored in the browser;
//     a user with no saved theme gets the current one saved;
//   - while logged in, every theme change is saved.
// Logged out, theme.js keeps working with localStorage alone.

const isKnownTheme = id => THEMES.some(theme => theme.id === id);

async function saveTheme(id) {
    if (!auth.authenticated || auth.user.theme === id) return;
    try {
        const user = await UserService.updateSettings({theme: id});
        auth.user.theme = user.theme;
    } catch (e) {
        // Still applied and stored in the browser, just not on the account
        console.warn('[theme] The theme could not be saved to the user settings', e);
    }
}

auth.addEventListener('auth-changed', () => {
    if (!auth.authenticated) return;
    const saved = auth.user.theme;
    if (isKnownTheme(saved)) {
        setTheme(saved); // no-op if already active; saveTheme then skips (same id)
    } else {
        saveTheme(getTheme().id);
    }
});

onThemeChange(theme => saveTheme(theme.id));
