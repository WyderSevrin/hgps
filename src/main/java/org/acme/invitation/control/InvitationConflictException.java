package org.acme.invitation.control;

/**
 * Thrown when an action conflicts with the current state: inviting oneself, inviting
 * someone who is already a friend or already has an open invitation, or answering an
 * invitation that is no longer pending.
 */
public class InvitationConflictException extends RuntimeException {

    public InvitationConflictException(String message) {
        super(message);
    }
}
