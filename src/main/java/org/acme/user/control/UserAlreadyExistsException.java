package org.acme.user.control;

/** Thrown when the username or the email is already used by another user. */
public class UserAlreadyExistsException extends RuntimeException {

    public UserAlreadyExistsException(String field, String value) {
        super("A user with " + field + " '" + value + "' already exists");
    }
}
