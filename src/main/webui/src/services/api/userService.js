import {apiRequest} from "./apiClient.js";

/**
 * Users from the backend (/api/users), read only.
 * Returns the API objects as they are:
 *   {id, username, email, displayName, language, createdAt, updatedAt}
 * The logged-in user itself is auth.user (from /api/me).
 * Errors are thrown as ApiError.
 */
export class UserService {

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
     * @returns {Promise<Array<{id, username, displayName}>>} best matches first
     */
    static search(term, limit = 10) {
        return apiRequest('GET', '/users/search', {query: {q: term, limit}});
    }
}
