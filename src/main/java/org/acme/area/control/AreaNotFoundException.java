package org.acme.area.control;

import java.util.UUID;

/**
 * Thrown when an area does not exist, or is a private area of another user:
 * private areas of others are reported as not found, so their existence is not revealed.
 */
public class AreaNotFoundException extends RuntimeException {

    public AreaNotFoundException(UUID id) {
        super("Area " + id + " not found");
    }
}
