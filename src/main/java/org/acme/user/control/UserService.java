package org.acme.user.control;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.acme.user.control.dto.UserRequestDto;
import org.acme.user.control.dto.UserResponseDto;
import org.acme.user.entity.User;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * Business logic and persistence for users.
 */
@ApplicationScoped
@RequiredArgsConstructor
public class UserService {

    private static final String DEFAULT_LANGUAGE = "en";
    private static final List<String> SUPPORTED_LANGUAGES = List.of("en", "de", "fr", "it");

    private final EntityManager em;

    public List<UserResponseDto> findAll() {
        return em.createQuery("SELECT u FROM User u ORDER BY u.username", User.class)
                .getResultStream()
                .map(UserResponseDto::from)
                .toList();
    }

    public UserResponseDto findById(UUID id) {
        return UserResponseDto.from(getUser(id));
    }

    @Transactional
    public UserResponseDto create(UserRequestDto request) {
        User user = new User();
        apply(user, request);
        em.persist(user);
        em.flush(); // so the generated timestamps are set in the response
        return UserResponseDto.from(user);
    }

    @Transactional
    public UserResponseDto update(UUID id, UserRequestDto request) {
        User user = getUser(id);
        apply(user, request);
        em.flush(); // so updatedAt is refreshed in the response
        return UserResponseDto.from(user);
    }

    @Transactional
    public void delete(UUID id) {
        // The user's areas and friend invitations are removed by ON DELETE CASCADE.
        em.remove(getUser(id));
    }

    /**
     * Returns the application user behind a Keycloak account, creating it on the first login.
     * <ol>
     *     <li>already linked: found by its Keycloak id ("sub" claim)</li>
     *     <li>existing user with the same e-mail, not linked yet: linked to the account</li>
     *     <li>otherwise: a new user is created from the token claims</li>
     * </ol>
     */
    @Transactional
    public UserResponseDto findOrCreateFromToken(TokenUser token) {
        User user = em.createQuery("SELECT u FROM User u WHERE u.keycloakId = :sub", User.class)
                .setParameter("sub", token.subject())
                .getResultStream()
                .findFirst()
                .orElseGet(() -> linkOrCreate(token));
        return UserResponseDto.from(user);
    }

    private User linkOrCreate(TokenUser token) {
        if (token.email() != null) {
            User existing = em.createQuery(
                            "SELECT u FROM User u WHERE lower(u.email) = lower(:email) AND u.keycloakId IS NULL", User.class)
                    .setParameter("email", token.email().trim())
                    .getResultStream()
                    .findFirst()
                    .orElse(null);
            if (existing != null) {
                existing.setKeycloakId(token.subject());
                return existing;
            }
        }

        String username = availableUsername(token.username());
        User user = new User();
        user.setKeycloakId(token.subject());
        user.setUsername(username);
        user.setEmail(token.email() != null ? token.email().trim() : username + "@users.hgps.local");
        user.setDisplayName(token.name() != null && !token.name().isBlank() ? token.name().trim() : username);
        // List.of(...).contains(null) throws, and the locale claim is often missing
        user.setLanguage(token.locale() != null && SUPPORTED_LANGUAGES.contains(token.locale())
                ? token.locale() : DEFAULT_LANGUAGE);
        em.persist(user);
        em.flush(); // so the generated id and timestamps are set in the response
        return user;
    }

    /**
     * Turns a Keycloak username into one that fits app_user (^[a-z0-9._-]{3,30}$)
     * and is not taken yet, adding a number at the end if needed.
     */
    private String availableUsername(String keycloakUsername) {
        String base = keycloakUsername == null ? "" : keycloakUsername.trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9._-]", ".");
        if (base.length() < 3) {
            base = (base + "user").substring(0, Math.max(base.length(), 4));
        }
        base = base.substring(0, Math.min(base.length(), 26)); // room for a numeric suffix
        String candidate = base;
        for (int i = 2; isTaken("username", candidate, null); i++) {
            candidate = base + i;
        }
        return candidate;
    }

    private User getUser(UUID id) {
        User user = em.find(User.class, id);
        if (user == null) {
            throw new UserNotFoundException(id);
        }
        return user;
    }

    private void apply(User user, UserRequestDto request) {
        String username = request.getUsername().trim().toLowerCase(Locale.ROOT);
        String email = request.getEmail().trim();

        if (isTaken("username", username, user.getId())) {
            throw new UserAlreadyExistsException("username", username);
        }
        if (isTaken("email", email, user.getId())) {
            throw new UserAlreadyExistsException("email", email);
        }

        user.setUsername(username);
        user.setEmail(email);
        user.setDisplayName(request.getDisplayName().trim());
        user.setLanguage(request.getLanguage() == null ? DEFAULT_LANGUAGE : request.getLanguage());
    }

    /** Case-insensitive, like the unique indexes on app_user. Ignores the user being updated. */
    private boolean isTaken(String field, String value, UUID excludedId) {
        String jpql = "SELECT COUNT(u) FROM User u WHERE lower(u." + field + ") = lower(:value)";
        if (excludedId != null) {
            jpql += " AND u.id <> :excludedId";
        }
        var query = em.createQuery(jpql, Long.class).setParameter("value", value);
        if (excludedId != null) {
            query.setParameter("excludedId", excludedId);
        }
        return query.getSingleResult() > 0;
    }
}
