-- =====================================================================
-- V7.1 - Sample notifications (dev profile only), for the demo user.
-- Match the sample invitations of V1_1: the requests of Emma and Lukas
-- (PENDING) and Bruno accepting demo's request.
-- Numbered after V7 because the table is created there.
-- =====================================================================
INSERT INTO notification (recipient_id, actor_id, type, is_read, created_at)
SELECT r.id, a.id, n.type, n.is_read, n.created_at
FROM (VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'FRIEND_REQUEST',
              FALSE, now() - INTERVAL '4 minutes'),
             ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'REQUEST_ACCEPTED',
              TRUE, now() - INTERVAL '1 day 3 hours'),
             ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'FRIEND_REQUEST',
              TRUE, now() - INTERVAL '3 days'))
         AS n (recipient_uuid, actor_uuid, type, is_read, created_at)
         JOIN app_user r ON r.uuid = n.recipient_uuid::uuid
         JOIN app_user a ON a.uuid = n.actor_uuid::uuid;
