-- =====================================================================
-- V3 - Friend invitations are no longer cancelled but deleted.
--
-- A request withdrawn by its sender, and a friendship ended by one of
-- the two friends, are deleted (DELETE /api/invitations/{id}): no
-- history is kept for them. Declined invitations stay (status DECLINED)
-- and do not block a new invitation (see ux_friend_invitation_pair).
-- =====================================================================

-- Former cancellations: removed like a cancellation is now
DELETE FROM friend_invitation WHERE status = 'CANCELLED';

ALTER TABLE friend_invitation DROP CONSTRAINT ck_friend_invitation_status;
ALTER TABLE friend_invitation
    ADD CONSTRAINT ck_friend_invitation_status CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED'));
