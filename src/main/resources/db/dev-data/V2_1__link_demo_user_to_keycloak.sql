-- =====================================================================
-- V2.1 - Sample data (dev profile only).
-- Links the "demo" user to the default Keycloak account of the same name
-- (fixed id in docker/keycloak/hgps-realm.json, login demo / demo).
-- =====================================================================

UPDATE app_user
SET keycloak_id = '8c0f6a2e-5b1d-4c3e-9f7a-1d2e3f4a5b6c'
WHERE id = '00000000-0000-0000-0000-000000000001';
