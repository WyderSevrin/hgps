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
