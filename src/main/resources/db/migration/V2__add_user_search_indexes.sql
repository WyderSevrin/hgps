-- =====================================================================
-- V2 - Indexes for the user search (GET /api/users/search).
--
-- The search matches a part of the username or display name
-- (lower(...) LIKE '%term%'). A normal B-tree index cannot serve a
-- pattern that starts with %, so without these indexes every search
-- would read the whole app_user table. Trigram (pg_trgm) GIN indexes
-- can answer such "contains" searches.
-- pg_trgm ships with PostgreSQL and is a trusted extension, so the
-- database owner can create it.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX ix_app_user_username_trgm ON app_user USING gin (lower(username) gin_trgm_ops);
CREATE INDEX ix_app_user_display_name_trgm ON app_user USING gin (lower(display_name) gin_trgm_ops);
