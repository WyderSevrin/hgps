import {apiRequest} from "./apiClient.js";

/**
 * Friend invitations of the logged-in user, from the backend (/api/invitations).
 * Returns the API objects as they are:
 *   {id, sender: {id, username, displayName}, receiver: {...}, status, createdAt, respondedAt}
 * status: PENDING, ACCEPTED, DECLINED or CANCELLED.
 * Errors are thrown as ApiError.
 *
 * Invitations are never deleted (they are kept as history): an invitation is
 * removed from the open ones by cancelling it (sender) or declining it (receiver).
 */
export class InvitationService {

    static DIRECTION = Object.freeze({INCOMING: 'incoming', OUTGOING: 'outgoing'});
    static STATUS = Object.freeze({PENDING: 'PENDING', ACCEPTED: 'ACCEPTED', DECLINED: 'DECLINED', CANCELLED: 'CANCELLED'});

    /**
     * @param {object} [filter]
     * @param {string} [filter.direction] InvitationService.DIRECTION.*, both when not set
     * @param {string} [filter.status]    InvitationService.STATUS.*, all when not set
     * @returns {Promise<object[]>} newest first
     */
    static list({direction, status} = {}) {
        return apiRequest('GET', '/invitations', {query: {direction, status}});
    }

    /** @returns {Promise<object>} */
    static get(id) {
        return apiRequest('GET', `/invitations/${id}`);
    }

    /** The sender withdraws a pending invitation. @returns {Promise<object>} the updated invitation */
    static cancel(id) {
        return apiRequest('POST', `/invitations/${id}/cancel`);
    }

    /** The receiver declines a pending invitation. @returns {Promise<object>} the updated invitation */
    static decline(id) {
        return apiRequest('POST', `/invitations/${id}/decline`);
    }
}
