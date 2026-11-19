-- =====================================================================
-- V7 - Notifications: "Emma sent you a friend request", ...
--
-- recipient_id  the user who sees the notification.
-- actor_id      the user who caused it; nullable for future system
--               notifications that have no actor.
-- type          NotificationType in the backend (FRIEND_REQUEST, ...).
-- is_read       set once the recipient has opened the notifications.
-- A notification the user clears is deleted, no history is kept.
-- =====================================================================
CREATE SEQUENCE notification_seq INCREMENT BY 50;

CREATE TABLE notification
(
    id           BIGINT      NOT NULL DEFAULT nextval('notification_seq'),
    uuid         UUID        NOT NULL DEFAULT gen_random_uuid(),
    recipient_id BIGINT      NOT NULL,
    actor_id     BIGINT,
    type         VARCHAR(30) NOT NULL,
    is_read      BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT pk_notification PRIMARY KEY (id),
    CONSTRAINT uq_notification_uuid UNIQUE (uuid),
    CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_id) REFERENCES app_user (id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_actor FOREIGN KEY (actor_id) REFERENCES app_user (id) ON DELETE CASCADE,
    CONSTRAINT ck_notification_type CHECK (type IN ('FRIEND_REQUEST', 'REQUEST_ACCEPTED'))
);

ALTER SEQUENCE notification_seq OWNED BY notification.id;

-- "My notifications, newest first"
CREATE INDEX ix_notification_recipient ON notification (recipient_id, created_at DESC);
