package org.acme.invitation.entity;

import java.util.Locale;

/**
 * Matches the ck_friend_invitation_status constraint.
 * There is no "cancelled" or "removed" status: a request withdrawn by its sender and a
 * friendship ended by one of the friends are deleted (see V3__remove_cancelled_invitation_status.sql).
 */
public enum InvitationStatus {
    /** Sent, waiting for the receiver. */
    PENDING,
    /** Accepted by the receiver: the two users are friends. */
    ACCEPTED,
    /** Declined by the receiver. Kept, and does not prevent a new invitation. */
    DECLINED;

    /** Used by JAX-RS for query parameters, so ?status=pending also works. */
    public static InvitationStatus fromString(String value) {
        return valueOf(value.trim().toUpperCase(Locale.ROOT));
    }
}
