import {auth} from "../auth/authService.js";

/**
 * Error of a backend call. The backend answers errors as
 *   {"message": "..."}                                  (ExceptionMappers: 400, 403, 404, 409)
 *   {"title": "...", "violations": [{field, message}]}  (validation: 400)
 */
export class ApiError extends Error {

    constructor(status, message, violations = []) {
        super(message);
        this.name = 'ApiError';
        /** HTTP status, e.g. 404. */
        this.status = status;
        /** Validation errors: [{field, message}], empty for other errors. */
        this.violations = violations;
    }

    get notFound() { return this.status === 404; }
    get forbidden() { return this.status === 403; }
    get conflict() { return this.status === 409; }

    static async from(response) {
        let body = null;
        try {
            body = await response.json();
        } catch {
            // no JSON body (e.g. 401 from the security layer)
        }
        const message = body?.message ?? body?.title ?? `${response.status} ${response.statusText}`;
        return new ApiError(response.status, message, body?.violations ?? []);
    }
}

/**
 * Calls the backend under /api with the logged-in user's token (refreshed if needed).
 *
 * @param {string} method  GET, POST, PUT, DELETE
 * @param {string} path    e.g. '/areas' or '/areas/<id>'
 * @param {object} [options]
 * @param {object} [options.query] query parameters; null/undefined values are left out
 * @param {*}      [options.body]  sent as JSON
 * @returns {Promise<*>} the parsed JSON, or null for an empty answer (204)
 * @throws {ApiError} when the backend answers with an error status
 */
export async function apiRequest(method, path, {query, body} = {}) {
    const headers = {Accept: 'application/json'};
    const init = {method, headers};
    if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
    }

    const response = await auth.fetch(`/api${path}${queryString(query)}`, init);
    if (!response.ok) {
        throw await ApiError.from(response);
    }
    return response.status === 204 ? null : response.json();
}

function queryString(query = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== null && value !== undefined && value !== '') {
            params.set(key, value);
        }
    }
    const text = params.toString();
    return text ? `?${text}` : '';
}
