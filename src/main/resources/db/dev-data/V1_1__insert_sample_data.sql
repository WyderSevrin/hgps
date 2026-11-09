-- =====================================================================
-- V1.1 - Sample data (dev profile only, see quarkus.flyway.locations).
-- Mirrors the placeholder data of the frontend (friends panel,
-- notifications) so the UI can be wired to the backend without surprises.
-- Fixed UUIDs keep the rows easy to reference while developing.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------
INSERT INTO app_user (id, username, email, display_name, language)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo',    'demo@hgps.local',    'Demo Prospector', 'en'),
       ('00000000-0000-0000-0000-000000000002', 'alice.m', 'alice.m@hgps.local', 'Alice Martin',    'fr'),
       ('00000000-0000-0000-0000-000000000003', 'bkeller', 'bkeller@hgps.local', 'Bruno Keller',    'de'),
       ('00000000-0000-0000-0000-000000000004', 'chiara',  'chiara@hgps.local',  'Chiara Rossi',    'it'),
       ('00000000-0000-0000-0000-000000000005', 'dmeier',  'dmeier@hgps.local',  'David Meier',     'de'),
       ('00000000-0000-0000-0000-000000000006', 'emma.w',  'emma.w@hgps.local',  'Emma Weber',      'de'),
       ('00000000-0000-0000-0000-000000000007', 'lhuber',  'lhuber@hgps.local',  'Lukas Huber',     'de');


-- ---------------------------------------------------------------------
-- Areas (around Bern and the Napf region)
-- ---------------------------------------------------------------------
INSERT INTO area (id, owner_id, name, description, gold_presence, is_private)
VALUES ('00000000-0000-0000-0000-00000000a001', '00000000-0000-0000-0000-000000000001',
        'Fankhausgraben', 'Small creek below the Napf, fine flakes in the gravel bars after high water.', 4, TRUE),
       ('00000000-0000-0000-0000-00000000a002', '00000000-0000-0000-0000-000000000001',
        'Emme near Burgdorf', 'Inside bends of the Emme, a few colours per pan.', 2, FALSE),
       ('00000000-0000-0000-0000-00000000a003', '00000000-0000-0000-0000-000000000002',
        'Aare bend', 'Gravel bank at the Aare bend, glacial gold, very fine.', 1, FALSE),
       ('00000000-0000-0000-0000-00000000a004', '00000000-0000-0000-0000-000000000003',
        'Krümpelgraben', 'Steep side creek of the Napf, bedrock cracks worth checking.', 3, FALSE),
       ('00000000-0000-0000-0000-00000000a005', '00000000-0000-0000-0000-000000000004',
        'Grosse Fontanne', 'Not sampled yet, to explore next summer.', 0, TRUE);


-- ---------------------------------------------------------------------
-- Area vertices (polygon corners, ordered by position)
-- ---------------------------------------------------------------------
INSERT INTO area_vertex (area_id, position, lat, lng)
VALUES -- Fankhausgraben
       ('00000000-0000-0000-0000-00000000a001', 0, 46.9712, 7.8885),
       ('00000000-0000-0000-0000-00000000a001', 1, 46.9731, 7.8921),
       ('00000000-0000-0000-0000-00000000a001', 2, 46.9718, 7.8952),
       ('00000000-0000-0000-0000-00000000a001', 3, 46.9699, 7.8913),
       -- Emme near Burgdorf
       ('00000000-0000-0000-0000-00000000a002', 0, 47.0512, 7.6198),
       ('00000000-0000-0000-0000-00000000a002', 1, 47.0534, 7.6241),
       ('00000000-0000-0000-0000-00000000a002', 2, 47.0519, 7.6268),
       ('00000000-0000-0000-0000-00000000a002', 3, 47.0497, 7.6224),
       -- Aare bend
       ('00000000-0000-0000-0000-00000000a003', 0, 46.9321, 7.4531),
       ('00000000-0000-0000-0000-00000000a003', 1, 46.9338, 7.4567),
       ('00000000-0000-0000-0000-00000000a003', 2, 46.9322, 7.4589),
       ('00000000-0000-0000-0000-00000000a003', 3, 46.9305, 7.4552),
       -- Krümpelgraben
       ('00000000-0000-0000-0000-00000000a004', 0, 46.9921, 7.8702),
       ('00000000-0000-0000-0000-00000000a004', 1, 46.9940, 7.8735),
       ('00000000-0000-0000-0000-00000000a004', 2, 46.9928, 7.8761),
       ('00000000-0000-0000-0000-00000000a004', 3, 46.9909, 7.8728),
       -- Grosse Fontanne
       ('00000000-0000-0000-0000-00000000a005', 0, 47.0011, 7.9802),
       ('00000000-0000-0000-0000-00000000a005', 1, 47.0029, 7.9838),
       ('00000000-0000-0000-0000-00000000a005', 2, 47.0014, 7.9861),
       ('00000000-0000-0000-0000-00000000a005', 3, 46.9996, 7.9825);


-- ---------------------------------------------------------------------
-- Friend invitations
--   demo is friends with Alice, Bruno, Chiara and David (ACCEPTED),
--   has two incoming requests from Emma and Lukas (PENDING),
--   and Alice once declined Lukas (history).
-- ---------------------------------------------------------------------
INSERT INTO friend_invitation (sender_id, receiver_id, status, created_at, responded_at)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'ACCEPTED',
        now() - INTERVAL '30 days', now() - INTERVAL '29 days'),
       ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'ACCEPTED',
        now() - INTERVAL '2 days', now() - INTERVAL '1 day 3 hours'),
       ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'ACCEPTED',
        now() - INTERVAL '12 days', now() - INTERVAL '12 days'),
       ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'ACCEPTED',
        now() - INTERVAL '20 days', now() - INTERVAL '18 days'),
       ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'PENDING',
        now() - INTERVAL '4 minutes', NULL),
       ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'PENDING',
        now() - INTERVAL '3 days', NULL),
       ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000002', 'DECLINED',
        now() - INTERVAL '10 days', now() - INTERVAL '9 days');
