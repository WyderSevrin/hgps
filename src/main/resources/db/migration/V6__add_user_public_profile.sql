-- =====================================================================
-- V6 - Public profile as a user setting.
--
-- Decides who sees a user's PUBLIC areas (private areas are only ever
-- seen by their owner):
--   FALSE (default): only the user's friends.
--   TRUE:            every logged-in user, friend or not.
-- Changed in User options > Account (PATCH /api/me/settings).
-- =====================================================================

ALTER TABLE app_user ADD COLUMN public_profile BOOLEAN NOT NULL DEFAULT FALSE;
