package org.acme.invitation.control;

import java.util.Locale;

/** Filter for listing invitations, seen from the logged-in user. */
public enum InvitationDirection {
    /** Invitations the user received. */
    INCOMING,
    /** Invitations the user sent. */
    OUTGOING;

    /** Used by JAX-RS for query parameters, so ?direction=incoming also works. */
    public static InvitationDirection fromString(String value) {
        return valueOf(value.trim().toUpperCase(Locale.ROOT));
    }
}
