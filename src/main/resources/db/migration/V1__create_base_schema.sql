-- =====================================================================
-- V1 - Base schema: users, areas (with their polygon vertices)
--      and friend invitations.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Users
-- "user" is a reserved word in PostgreSQL, hence app_user.
-- ---------------------------------------------------------------------
CREATE TABLE app_user
(
    id           UUID         NOT NULL DEFAULT gen_random_uuid(),
    username     VARCHAR(30)  NOT NULL, -- the "@handle" shown in the friends panel
    email        VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    language     VARCHAR(2)   NOT NULL DEFAULT 'en',
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT pk_app_user PRIMARY KEY (id),
    CONSTRAINT ck_app_user_username CHECK (username ~ '^[a-z0-9._-]{3,30}$'),
    CONSTRAINT ck_app_user_language CHECK (language IN ('en', 'de', 'fr', 'it'))
);

-- Case-insensitive uniqueness, also used by the user search
CREATE UNIQUE INDEX ux_app_user_username ON app_user (lower(username));
CREATE UNIQUE INDEX ux_app_user_email ON app_user (lower(email));


-- ---------------------------------------------------------------------
-- Areas: a zone drawn on the map by a user.
-- gold_presence: 0 = not determined yet, 1..5 = increasing presence
-- (same scale as Area.GOLD_PRESENCE_MIN / MAX in the frontend).
-- ---------------------------------------------------------------------
CREATE TABLE area
(
    id            UUID         NOT NULL DEFAULT gen_random_uuid(),
    owner_id      UUID         NOT NULL,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    gold_presence SMALLINT     NOT NULL DEFAULT 0,
    is_private    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),

    CONSTRAINT pk_area PRIMARY KEY (id),
    CONSTRAINT fk_area_owner FOREIGN KEY (owner_id) REFERENCES app_user (id) ON DELETE CASCADE,
    CONSTRAINT ck_area_gold_presence CHECK (gold_presence BETWEEN 0 AND 5)
);

CREATE INDEX ix_area_owner ON area (owner_id);


-- ---------------------------------------------------------------------
-- Area vertices: the ordered corners of an area's polygon.
-- ---------------------------------------------------------------------
CREATE TABLE area_vertex
(
    id       UUID             NOT NULL DEFAULT gen_random_uuid(),
    area_id  UUID             NOT NULL,
    position INTEGER          NOT NULL, -- Vertex.index in the frontend
    lat      DOUBLE PRECISION NOT NULL,
    lng      DOUBLE PRECISION NOT NULL,

    CONSTRAINT pk_area_vertex PRIMARY KEY (id),
    CONSTRAINT fk_area_vertex_area FOREIGN KEY (area_id) REFERENCES area (id) ON DELETE CASCADE,
    CONSTRAINT uq_area_vertex_position UNIQUE (area_id, position),
    CONSTRAINT ck_area_vertex_position CHECK (position >= 0),
    CONSTRAINT ck_area_vertex_lat CHECK (lat BETWEEN -90 AND 90),
    CONSTRAINT ck_area_vertex_lng CHECK (lng BETWEEN -180 AND 180)
);


-- ---------------------------------------------------------------------
-- Friend invitations.
-- Two users are friends when an invitation between them is ACCEPTED,
-- so no separate friendship table is needed.
-- ---------------------------------------------------------------------
CREATE TABLE friend_invitation
(
    id           UUID        NOT NULL DEFAULT gen_random_uuid(),
    sender_id    UUID        NOT NULL,
    receiver_id  UUID        NOT NULL,
    status       VARCHAR(10) NOT NULL DEFAULT 'PENDING',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at TIMESTAMPTZ,

    CONSTRAINT pk_friend_invitation PRIMARY KEY (id),
    CONSTRAINT fk_friend_invitation_sender FOREIGN KEY (sender_id) REFERENCES app_user (id) ON DELETE CASCADE,
    CONSTRAINT fk_friend_invitation_receiver FOREIGN KEY (receiver_id) REFERENCES app_user (id) ON DELETE CASCADE,
    CONSTRAINT ck_friend_invitation_not_self CHECK (sender_id <> receiver_id),
    CONSTRAINT ck_friend_invitation_status CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED')),
    CONSTRAINT ck_friend_invitation_responded CHECK ((status = 'PENDING') = (responded_at IS NULL))
);

-- At most one open or accepted invitation per pair of users, whatever the direction.
-- Declined/cancelled ones are kept as history and do not block a new invitation.
CREATE UNIQUE INDEX ux_friend_invitation_pair
    ON friend_invitation (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
    WHERE status IN ('PENDING', 'ACCEPTED');

-- "My incoming requests" and "my friends" lookups
CREATE INDEX ix_friend_invitation_receiver ON friend_invitation (receiver_id, status);
CREATE INDEX ix_friend_invitation_sender ON friend_invitation (sender_id, status);
