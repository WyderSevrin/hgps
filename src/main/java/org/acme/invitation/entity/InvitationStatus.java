package org.acme.invitation.entity;

import java.util.Locale;

/** Matches the ck_friend_invitation_status constraint. */
public enum InvitationStatus {
    /** Sent, waiting for the receiver. */
    PENDING,
    /** Accepted by the receiver: the two users are friends. */
    ACCEPTED,
    /** Declined by the receiver. */
    DECLINED,
    /** Withdrawn by the sender before the receiver answered. */
    CANCELLED;

    /** Used by JAX-RS for query parameters, so ?status=pending also works. */
    public static InvitationStatus fromString(String value) {
        return valueOf(value.trim().toUpperCase(Locale.ROOT));
    }
}
