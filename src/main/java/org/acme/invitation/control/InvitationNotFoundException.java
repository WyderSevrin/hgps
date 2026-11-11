package org.acme.invitation.control;

import java.util.UUID;

/**
 * Thrown when an invitation does not exist, or when the logged-in user is neither its
 * sender nor its receiver: invitations of other users are reported as not found
 * rather than forbidden, so their existence is not revealed.
 */
public class InvitationNotFoundException extends RuntimeException {

    public InvitationNotFoundException(UUID id) {
        super("Invitation " + id + " not found");
    }
}
