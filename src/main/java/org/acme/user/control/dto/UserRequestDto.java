package org.acme.user.control.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Body of POST and PUT /api/users. The rules match the constraints of the app_user table.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {

    @NotBlank
    @Pattern(regexp = "^\\s*[A-Za-z0-9._-]{3,30}\\s*$",
            message = "must be 3 to 30 characters: letters, digits, '.', '_' or '-'")
    private String username;

    @NotBlank
    @Email
    @Size(max = 255)
    private String email;

    @NotBlank
    @Size(max = 100)
    private String displayName;

    /** Optional, defaults to "en". */
    @Pattern(regexp = "en|de|fr|it", message = "must be one of en, de, fr, it")
    private String language;
}
