package org.acme.invitation.control;

/**
 * Thrown when a participant of an invitation does an action reserved for the other one,
 * e.g. the sender tries to accept it.
 */
public class InvitationForbiddenException extends RuntimeException {

    public InvitationForbiddenException(String message) {
        super(message);
    }
}
