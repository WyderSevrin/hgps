import {apiRequest} from "./apiClient.js";

/**
 * Users from the backend (/api/users), read only.
 * Returns the API objects as they are:
 *   {id, username, email, displayName, language, createdAt, updatedAt}
 * The logged-in user itself is auth.user (from /api/me).
 * Errors are thrown as ApiError.
 */
export class UserService {

    /** Shortest search term the backend accepts (GET /api/users/search). */
    static MIN_SEARCH_LENGTH = 2;

    /** @returns {Promise<object[]>} sorted by username */
    static list() {
        return apiRequest('GET', '/users');
    }

    /** @returns {Promise<object>} */
    static get(id) {
        return apiRequest('GET', `/users/${id}`);
    }

    /**
     * Users whose username or display name contains the term (case-insensitive),
     * the logged-in user excluded. Requires a logged-in user.
     * @param {string} term  at least 2 characters; a leading "@" is ignored
     * @param {number} [limit] 1 to 20, default 10
     * @param {object} [options]
     * @param {boolean} [options.areasVisible] only the users whose public areas the logged-in
     *                                         user may see: friends and public profiles
     * @returns {Promise<Array<{id, username, displayName}>>} best matches first
     */
    static search(term, limit = 10, {areasVisible = false} = {}) {
        return apiRequest('GET', '/users/search', {query: {q: term, limit, areasVisible}});
    }

    /**
     * Saves preferences of the logged-in user. Fields left out are unchanged.
     * @param {{theme?: string, mapStyle?: string, language?: string, publicProfile?: boolean}} settings
     * @returns {Promise<object>} the updated user, like /api/me
     */
    static updateSettings(settings) {
        return apiRequest('PATCH', '/me/settings', {body: settings});
    }
}
