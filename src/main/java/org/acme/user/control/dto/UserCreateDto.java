package org.acme.user.control.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Body of POST and PUT /api/users: the fields of {@link UserDto} with the validation rules
 * for creating a user. The rules match the constraints of the app_user table.
 * <p>
 * The constraints are on overridden getters because the fields are inherited
 * (adding constraints to an inherited property in a subclass is allowed by Bean Validation).
 * id, createdAt and updatedAt are inherited too, but READ_ONLY: a client cannot set them.
 * <p>
 * Another use case with other rules (e.g. a UserEditDto) is a sibling class extending UserDto.
 */
public class UserCreateDto extends UserDto {

    @Override
    @NotBlank
    @Pattern(regexp = "^\\s*[A-Za-z0-9._-]{3,30}\\s*$",
            message = "must be 3 to 30 characters: letters, digits, '.', '_' or '-'")
    public String getUsername() {
        return super.getUsername();
    }

    @Override
    @NotBlank
    @Email
    @Size(max = 255)
    public String getEmail() {
        return super.getEmail();
    }

    @Override
    @NotBlank
    @Size(max = 100)
    public String getDisplayName() {
        return super.getDisplayName();
    }

    /** Optional, defaults to "en". */
    @Override
    @Pattern(regexp = "en|de|fr|it", message = "must be one of en, de, fr, it")
    public String getLanguage() {
        return super.getLanguage();
    }
}
