-- =====================================================================
-- V2 - Link application users to their Keycloak account.
-- keycloak_id is the "sub" claim of the access token. It is NULL until
-- the user logs in for the first time (see UserService.findOrCreateFromToken).
-- =====================================================================

ALTER TABLE app_user
    ADD COLUMN keycloak_id VARCHAR(255);

ALTER TABLE app_user
    ADD CONSTRAINT uq_app_user_keycloak_id UNIQUE (keycloak_id);
