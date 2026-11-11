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
}
