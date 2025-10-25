// convex/contacts.js
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/* ──────────────────────────────────────────────────────────────────────────
   1. getAllContacts – ALL people you've shared expenses with + groups
   ──────────────────────────────────────────────────────────────────────── */
export const getAllContacts = query({
  handler: async (ctx) => {
    // Use the centralized getCurrentUser instead of duplicating auth logic
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    /* ── Get ALL expenses (both 1-to-1 and group) involving current user ── */
    const allExpenses = await ctx.db.query("expenses").collect();
    
    const userExpenses = allExpenses.filter(
      (exp) =>
        exp.paidByUserId === currentUser._id ||
        exp.splits.some((s) => s.userId === currentUser._id)
    );

    /* ── extract unique counterpart IDs from ALL expenses ──────────────── */
    const contactIds = new Set();
    userExpenses.forEach((exp) => {
      if (exp.paidByUserId !== currentUser._id)
        contactIds.add(exp.paidByUserId);

      exp.splits.forEach((s) => {
        if (s.userId !== currentUser._id) contactIds.add(s.userId);
      });
    });

    /* ── Also add all group members (even if no expenses yet) ─────────── */
    const allGroups = await ctx.db.query("groups").collect();
    const myGroups = allGroups.filter((g) => 
      g.members.some((m) => m.userId === currentUser._id)
    );
    
    myGroups.forEach((group) => {
      group.members.forEach((member) => {
        if (member.userId !== currentUser._id) {
          contactIds.add(member.userId);
        }
      });
    });

    /* ── fetch user docs ───────────────────────────────────────────────── */
    const contactUsers = await Promise.all(
      [...contactIds].map(async (id) => {
        const u = await ctx.db.get(id);
        return u
          ? {
              id: u._id,
              name: u.name,
              email: u.email,
              imageUrl: u.imageUrl,
              type: "user",
            }
          : null;
      })
    );

    /* ── format groups for display ─────────────────────────────────────── */
    const userGroups = myGroups.map((g) => ({
      id: g._id,
      name: g.name,
      description: g.description,
      memberCount: g.members.length,
      type: "group",
    }));

    /* sort alphabetically */
    contactUsers.sort((a, b) => a?.name.localeCompare(b?.name));
    userGroups.sort((a, b) => a.name.localeCompare(b.name));

    return { users: contactUsers.filter(Boolean), groups: userGroups };
  },
});

/* ──────────────────────────────────────────────────────────────────────────
   2. createGroup – create a new group
   ──────────────────────────────────────────────────────────────────────── */
export const createGroup = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    members: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Use the centralized getCurrentUser instead of duplicating auth logic
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    if (!args.name.trim()) throw new Error("Group name cannot be empty");

    const uniqueMembers = new Set(args.members);
    uniqueMembers.add(currentUser._id); // ensure creator

    // Validate that all member users exist
    for (const id of uniqueMembers) {
      if (!(await ctx.db.get(id)))
        throw new Error(`User with ID ${id} not found`);
    }

    const groupId = await ctx.db.insert("groups", {
      name: args.name.trim(),
      description: args.description?.trim() ?? "",
      createdBy: currentUser._id,
      members: [...uniqueMembers].map((id) => ({
        userId: id,
        role: id === currentUser._id ? "admin" : "member",
        joinedAt: Date.now(),
        addedBy: currentUser._id, // Track who added each member
      })),
    });

    // Log group creation activity
    await ctx.db.insert("activityLog", {
      groupId,
      type: "group_created",
      performedBy: currentUser._id,
      timestamp: Date.now(),
      metadata: {
        memberCount: uniqueMembers.size,
      }
    });

    return groupId;
  },
});