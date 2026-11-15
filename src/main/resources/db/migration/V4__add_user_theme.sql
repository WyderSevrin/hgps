-- =====================================================================
-- V4 - Color theme as a user setting.
--
-- The id of the theme chosen in User options > Appearance (e.g.
-- 'slate-gold', see webui/src/themes). NULL: no choice saved yet, the
-- frontend keeps the theme stored in the browser (or its default).
-- The list of themes lives in the frontend, so only the format is
-- checked here; an unknown id is ignored by the frontend.
-- =====================================================================

ALTER TABLE app_user ADD COLUMN theme VARCHAR(30);

ALTER TABLE app_user
    ADD CONSTRAINT ck_app_user_theme CHECK (theme ~ '^[a-z0-9-]{1,30}$');
