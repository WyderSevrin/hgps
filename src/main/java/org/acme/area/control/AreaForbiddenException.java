package org.acme.area.control;

import java.util.UUID;

/** Thrown when a user tries to change or delete a public area of another user. */
public class AreaForbiddenException extends RuntimeException {

    public AreaForbiddenException(UUID id) {
        super("Only the owner can change or delete area " + id);
    }
}
