package org.acme.user.control;

/**
 * The claims of a Keycloak access token that describe the logged-in user.
 *
 * @param subject  "sub": the Keycloak account id
 * @param username "preferred_username"
 * @param email    "email" (may be null)
 * @param name     "name": first + last name (may be null)
 * @param locale   "locale": UI language chosen in Keycloak (may be null)
 */
public record TokenUser(String subject, String username, String email, String name, String locale) {
}
