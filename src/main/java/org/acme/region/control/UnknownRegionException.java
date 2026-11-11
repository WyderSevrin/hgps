package org.acme.region.control;

/** Thrown when a request refers to a region code that does not exist (a client error, not a missing resource). */
public class UnknownRegionException extends RuntimeException {

    public UnknownRegionException(String code) {
        super("Unknown region '" + code + "'");
    }
}
