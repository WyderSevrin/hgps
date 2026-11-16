package org.acme.user.control.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Body of PATCH /api/me/settings: the preferences of the logged-in user.
 * Every field is optional, a missing (null) field is left unchanged.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsDto {

    /**
     * Format of the ids of options defined in the frontend (themes, map styles).
     * The lists themselves live in the frontend, so only the format is checked.
     */
    private static final String FRONTEND_ID = "[a-z0-9-]{1,30}";
    private static final String FRONTEND_ID_MESSAGE = "must be 1 to 30 characters: lower-case letters, digits or '-'";

    /** UI language. */
    @Pattern(regexp = "en|de|fr|it", message = "must be one of en, de, fr, it")
    private String language;

    /** Id of a frontend color theme, e.g. "slate-gold". */
    @Pattern(regexp = FRONTEND_ID, message = FRONTEND_ID_MESSAGE)
    private String theme;

    /** Id of a frontend map style, e.g. "topographic". */
    @Pattern(regexp = FRONTEND_ID, message = FRONTEND_ID_MESSAGE)
    private String mapStyle;
}
