import {apiRequest} from "./apiClient.js";

/**
 * Friend invitations of the logged-in user, from the backend (/api/invitations).
 * Returns the API objects as they are:
 *   {id, sender: {id, username, displayName}, receiver: {...}, status, createdAt, respondedAt}
 * status: PENDING, ACCEPTED (= the two users are friends) or DECLINED.
 * Errors are thrown as ApiError.
 *
 * Lifecycle:
 *   send()    -> PENDING
 *   accept()  -> ACCEPTED, by the receiver
 *   decline() -> DECLINED, by the receiver; kept, the sender can send a new request
 *   cancel()  -> deleted, by the sender of a PENDING request
 *   removeFriend() -> deleted, by either friend of an ACCEPTED invitation
 */
export class InvitationService {

    static DIRECTION = Object.freeze({INCOMING: 'incoming', OUTGOING: 'outgoing'});
    static STATUS = Object.freeze({PENDING: 'PENDING', ACCEPTED: 'ACCEPTED', DECLINED: 'DECLINED'});

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

    /**
     * Sends a friend request to a user.
     * 409 (ApiError.conflict) when already friends or a request between the two is pending.
     * @param {string} userId public id of the user to invite
     * @returns {Promise<object>} the new invitation (PENDING)
     */
    static send(userId) {
        return apiRequest('POST', `/invitations/to/${userId}`);
    }

    /** The receiver accepts a pending request. @returns {Promise<object>} the invitation, now ACCEPTED */
    static accept(id) {
        return apiRequest('POST', `/invitations/${id}/accept`);
    }

    /** The receiver declines a pending request. @returns {Promise<object>} the invitation, now DECLINED */
    static decline(id) {
        return apiRequest('POST', `/invitations/${id}/decline`);
    }

    /** The sender withdraws a pending request. It is deleted, not kept. */
    static cancel(id) {
        return InvitationService.#delete(id);
    }

    /** Ends a friendship: deletes the ACCEPTED invitation. Either friend can do it. */
    static removeFriend(invitationId) {
        return InvitationService.#delete(invitationId);
    }

    static async #delete(id) {
        await apiRequest('DELETE', `/invitations/${id}`);
    }
}
