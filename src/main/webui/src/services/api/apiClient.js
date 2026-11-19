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
 * @param {object} [options.query] query parameters; null/undefined values are left out,
 *                                 an array is sent as a repeated parameter (?owner=a&owner=b)
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

/**
 * Opens a Server-Sent Events stream under /api with the logged-in user's token.
 * The browser's EventSource cannot send an Authorization header, hence fetch + a small parser.
 *
 * @param {string} path  e.g. '/notifications/stream'
 * @param {object} handlers
 * @param {() => void}                  [handlers.onOpen]   once the connection is established
 * @param {(name: string, data: string) => void} handlers.onEvent for each event (comments are skipped)
 * @param {AbortSignal} [signal] aborts the stream
 * @returns {Promise<void>} resolves when the server closes the stream
 * @throws {ApiError} when the backend refuses the connection; other errors on network failures
 */
export async function apiStream(path, {onOpen, onEvent}, signal) {
    const response = await auth.fetch(`/api${path}`, {headers: {Accept: 'text/event-stream'}, signal});
    if (!response.ok) {
        throw await ApiError.from(response);
    }
    onOpen?.();

    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = '';
    while (true) {
        const {value, done} = await reader.read();
        if (done) return;
        // Events are separated by a blank line
        buffer += value.replace(/\r\n?/g, '\n');
        let end;
        while ((end = buffer.indexOf('\n\n')) >= 0) {
            const event = parseSseEvent(buffer.slice(0, end));
            buffer = buffer.slice(end + 2);
            if (event) onEvent(event.name, event.data);
        }
    }
}

/** One SSE block ("event: x\ndata: y") to {name, data}; null for a comment-only block (heartbeat). */
function parseSseEvent(block) {
    let name = 'message';
    const data = [];
    for (const line of block.split('\n')) {
        if (line.startsWith('event:')) name = line.slice(6).trim();
        else if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
    }
    return data.length ? {name, data: data.join('\n')} : null;
}

function queryString(query = {}) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        const values = Array.isArray(value) ? value : [value];
        for (const item of values) {
            if (item !== null && item !== undefined && item !== '') {
                params.append(key, item);
            }
        }
    }
    const text = params.toString();
    return text ? `?${text}` : '';
}
