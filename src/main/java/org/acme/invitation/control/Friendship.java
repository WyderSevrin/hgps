package org.acme.invitation.control;

/**
 * Friendship as a JPQL condition, for queries of other packages (areas, user search).
 * Two users are friends when an ACCEPTED invitation links them, in either direction
 * (there is no separate friendship table, see V1__create_base_schema.sql).
 */
public final class Friendship {

    private Friendship() {
    }

    /**
     * JPQL condition: true when the two users are friends.
     *
     * @param userA a JPQL expression of a User, e.g. ":me" or "a.owner"
     * @param userB a JPQL expression of a User
     */
    public static String areFriends(String userA, String userB) {
        return "EXISTS (SELECT f.id FROM FriendInvitation f"
                + " WHERE f.status = org.acme.invitation.entity.InvitationStatus.ACCEPTED"
                + " AND ((f.sender = " + userA + " AND f.receiver = " + userB + ")"
                + " OR (f.sender = " + userB + " AND f.receiver = " + userA + ")))";
    }
}
