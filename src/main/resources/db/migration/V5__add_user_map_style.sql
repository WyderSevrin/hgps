-- =====================================================================
-- V5 - Map style as a user setting.
--
-- The id of the map style chosen in User options > Map (e.g.
-- 'topographic', see webui/src/map-styles). NULL: no choice saved yet,
-- the frontend keeps the style stored in the browser (or its default).
-- Same rules as the theme (V4): the list of styles lives in the
-- frontend, so only the format is checked here.
-- =====================================================================

ALTER TABLE app_user ADD COLUMN map_style VARCHAR(30);

ALTER TABLE app_user
    ADD CONSTRAINT ck_app_user_map_style CHECK (map_style ~ '^[a-z0-9-]{1,30}$');
