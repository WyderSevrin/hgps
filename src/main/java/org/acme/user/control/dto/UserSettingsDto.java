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

    /** UI language. */
    @Pattern(regexp = "en|de|fr|it", message = "must be one of en, de, fr, it")
    private String language;

    /** Id of a frontend color theme, e.g. "slate-gold". */
    @Pattern(regexp = "[a-z0-9-]{1,30}", message = "must be 1 to 30 characters: lower-case letters, digits or '-'")
    private String theme;
}
