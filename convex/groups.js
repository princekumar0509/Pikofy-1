import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getGroupOrMembers = query({
  args: {
    groupId: v.optional(v.id("groups")), // Optional - if provided, will return details for just this group
  },
  handler: async (ctx, args) => {
    // Use centralized getCurrentUser function
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    // Get all groups where the user is a member
    const allGroups = await ctx.db.query("groups").collect();
    const userGroups = allGroups.filter((group) =>
      group.members.some((member) => member.userId === currentUser._id)
    );

    // If a specific group ID is provided, only return details for that group
    if (args.groupId) {
      const selectedGroup = userGroups.find(
        (group) => group._id === args.groupId
      );

      if (!selectedGroup) {
        throw new Error("Group not found or you're not a member");
      }

      // Get all user details for this group's members
      const memberDetails = await Promise.all(
        selectedGroup.members.map(async (member) => {
          const user = await ctx.db.get(member.userId);
          if (!user) return null;

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            imageUrl: user.imageUrl,
            role: member.role,
          };
        })
      );

      // Filter out any null values (in case a user was deleted)
      const validMembers = memberDetails.filter((member) => member !== null);

      // Return selected group with member details
      return {
        selectedGroup: {
          id: selectedGroup._id,
          name: selectedGroup.name,
          description: selectedGroup.description,
          createdBy: selectedGroup.createdBy,
          members: validMembers,
        },
        groups: userGroups.map((group) => ({
          id: group._id,
          name: group.name,
          description: group.description,
          memberCount: group.members.length,
        })),
      };
    } else {
      // Just return the list of groups without member details
      return {
        selectedGroup: null,
        groups: userGroups.map((group) => ({
          id: group._id,
          name: group.name,
          description: group.description,
          memberCount: group.members.length,
        })),
      };
    }
  },
});

// Get expenses for a specific group
export const getGroupExpenses = query({
  args: { 
    groupId: v.id("groups"),
    limit: v.optional(v.number()) // Optional: limit expenses/settlements for pagination
  },
  handler: async (ctx, { groupId, limit }) => {
    // Use centralized getCurrentUser function
    const currentUser = await ctx.runQuery(internal.users.getCurrentUser);

    const group = await ctx.db.get(groupId);
    if (!group) {
      return {
        error: "GROUP_NOT_FOUND",
        message: "Group not found or has been deleted"
      };
    }

    if (!group.members.some((m) => m.userId === currentUser._id)) {
      return {
        error: "NOT_MEMBER",
        message: "You are not a member of this group"
      };
    }

    // Fetch expenses with optional limit for better performance
    const expensesQuery = ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .order("desc");
    
    const expenses = limit 
      ? await expensesQuery.take(limit)
      : await expensesQuery.collect();

    // Fetch settlements with optional limit
    const settlementsQuery = ctx.db
      .query("settlements")
      .filter((q) => q.eq(q.field("groupId"), groupId));
    
    const settlements = limit
      ? await settlementsQuery.take(limit)
      : await settlementsQuery.collect();

    /* ----------  member map (optimized: batch fetch) ---------- */
    const memberIds = group.members.map(m => m.userId);
    const roleMap = Object.fromEntries(group.members.map(m => [m.userId, m.role]));
    
    // Batch fetch all users at once
    const users = await Promise.all(memberIds.map(id => ctx.db.get(id)));
    const memberDetails = users
      .filter(Boolean)
      .map(u => ({ 
        id: u._id, 
        name: u.name, 
        imageUrl: u.imageUrl, 
        role: roleMap[u._id] 
      }));
    const ids = memberDetails.map((m) => m.id);

    /* ----------  ledgers ---------- */
    // total net balance (old behaviour)
    const totals = Object.fromEntries(ids.map((id) => [id, 0]));
    // pair‑wise ledger  debtor -> creditor -> amount
    const ledger = {};
    ids.forEach((a) => {
      ledger[a] = {};
      ids.forEach((b) => {
        if (a !== b) ledger[a][b] = 0;
      });
    });

    /* ----------  apply expenses ---------- */
    for (const exp of expenses) {
      const payer = exp.paidByUserId;
      for (const split of exp.splits) {
        if (split.userId === payer || split.paid) continue; // skip payer & settled
        const debtor = split.userId;
        const amt = split.amount;

        totals[payer] += amt;
        totals[debtor] -= amt;

        ledger[debtor][payer] += amt; // debtor owes payer
      }
    }

    /* ----------  apply settlements ---------- */
    for (const s of settlements) {
      // When someone pays, their debt/balance goes DOWN (subtract)
      // When someone receives, their credit/balance goes UP (add)
      totals[s.paidByUserId] -= s.amount;
      totals[s.receivedByUserId] += s.amount;

      ledger[s.paidByUserId][s.receivedByUserId] -= s.amount; // they paid back
    }

    /* ----------  net the pair‑wise ledger (optimized with tolerance) ---------- */
    ids.forEach((a) => {
      ids.forEach((b) => {
        if (a >= b) return; // visit each unordered pair once
        const diff = ledger[a][b] - ledger[b][a];
        // Add floating-point tolerance
        if (Math.abs(diff) < 0.01) {
          ledger[a][b] = ledger[b][a] = 0;
        } else if (diff > 0) {
          ledger[a][b] = diff;
          ledger[b][a] = 0;
        } else {
          ledger[b][a] = -diff;
          ledger[a][b] = 0;
        }
      });
    });

    /* ----------  shape the response (optimized) ---------- */
    const userLookupMap = Object.fromEntries(
      memberDetails.map(m => [m.id, m])
    );

    const balances = memberDetails.map((m) => ({
      ...m,
      totalBalance: Math.abs(totals[m.id]) < 0.01 ? 0 : totals[m.id], // Apply tolerance
      owes: Object.entries(ledger[m.id])
        .filter(([, v]) => v > 0.01) // Skip tiny amounts
        .map(([to, amount]) => ({ to, amount })),
      owedBy: ids
        .filter((other) => ledger[other][m.id] > 0.01) // Skip tiny amounts
        .map((other) => ({ from: other, amount: ledger[other][m.id] })),
    }));

    return {
      group: {
        id: group._id,
        name: group.name,
        description: group.description,
      },
      members: memberDetails,
      expenses,
      settlements,
      balances,
      userLookupMap,
    };
  },
});

// Helper function to check if user is admin of a group
async function isUserAdmin(ctx, groupId, userId) {
  const group = await ctx.db.get(groupId);
  if (!group) return false;
  
  const member = group.members.find(m => m.userId === userId);
  return member && member.role === "admin";
}

// Helper function to get current user
async function getCurrentUser(ctx) {
  return await ctx.runQuery(internal.users.getCurrentUser);
}

// Delete group (admin only)
export const deleteGroup = mutation({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    const currentUser = await getCurrentUser(ctx);
    
    // Check if user is admin
    if (!(await isUserAdmin(ctx, groupId, currentUser._id))) {
      throw new Error("Only group admins can delete groups");
    }

    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Delete all related expenses
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();
    
    for (const expense of expenses) {
      await ctx.db.delete(expense._id);
    }

    // Delete all related settlements
    const settlements = await ctx.db
      .query("settlements")
      .filter((q) => q.eq(q.field("groupId"), groupId))
      .collect();
    
    for (const settlement of settlements) {
      await ctx.db.delete(settlement._id);
    }

    // Delete the group
    await ctx.db.delete(groupId);

    return { success: true, message: "Group deleted successfully" };
  },
});

// Remove member from group (admin only)
export const removeMember = mutation({
  args: { 
    groupId: v.id("groups"),
    memberId: v.id("users")
  },
  handler: async (ctx, { groupId, memberId }) => {
    const currentUser = await getCurrentUser(ctx);
    
    // Check if user is admin
    if (!(await isUserAdmin(ctx, groupId, currentUser._id))) {
      throw new Error("Only group admins can remove members");
    }

    // Prevent admin from removing themselves
    if (memberId === currentUser._id) {
      throw new Error("Admins cannot remove themselves. Use 'Leave Group' instead.");
    }

    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Check if member exists in group
    const memberIndex = group.members.findIndex(m => m.userId === memberId);
    if (memberIndex === -1) {
      throw new Error("Member not found in group");
    }

    // Remove member from group
    const updatedMembers = group.members.filter(m => m.userId !== memberId);
    
    await ctx.db.patch(groupId, {
      members: updatedMembers
    });

    // Log member removal activity
    await ctx.db.insert("activityLog", {
      groupId,
      type: "member_removed",
      performedBy: currentUser._id,
      targetUserId: memberId,
      timestamp: Date.now(),
      metadata: {
        memberCount: updatedMembers.length,
      }
    });

    // Delete all expenses where this member was involved
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();

    for (const expense of expenses) {
      const updatedSplits = expense.splits.filter(split => split.userId !== memberId);
      
      if (updatedSplits.length === 0) {
        // If no splits left, delete the expense
        await ctx.db.delete(expense._id);
      } else if (expense.paidByUserId === memberId) {
        // If the removed member was the payer, transfer to first remaining member
        await ctx.db.patch(expense._id, {
          paidByUserId: updatedSplits[0].userId,
          splits: updatedSplits.map(split => ({
            ...split,
            paid: split.userId === updatedSplits[0].userId
          }))
        });
      } else {
        // Just remove the member from splits
        await ctx.db.patch(expense._id, {
          splits: updatedSplits
        });
      }
    }

    // Delete settlements involving this member
    const settlements = await ctx.db
      .query("settlements")
      .filter((q) => q.eq(q.field("groupId"), groupId))
      .collect();

    for (const settlement of settlements) {
      if (settlement.paidByUserId === memberId || settlement.receivedByUserId === memberId) {
        await ctx.db.delete(settlement._id);
      }
    }

    return { success: true, message: "Member removed successfully" };
  },
});

// Transfer admin role to another member (admin only)
export const transferAdminRole = mutation({
  args: { 
    groupId: v.id("groups"),
    newAdminId: v.id("users")
  },
  handler: async (ctx, { groupId, newAdminId }) => {
    const currentUser = await getCurrentUser(ctx);
    
    // Check if current user is admin
    if (!(await isUserAdmin(ctx, groupId, currentUser._id))) {
      throw new Error("Only group admins can transfer admin role");
    }

    // Prevent transferring to self
    if (newAdminId === currentUser._id) {
      throw new Error("You are already the admin");
    }

    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Check if new admin is a member
    const newAdminMember = group.members.find(m => m.userId === newAdminId);
    if (!newAdminMember) {
      throw new Error("User is not a member of this group");
    }

    // Update member roles
    const updatedMembers = group.members.map(member => ({
      ...member,
      role: member.userId === newAdminId ? "admin" : "member"
    }));

    await ctx.db.patch(groupId, {
      members: updatedMembers
    });

    // Log admin transfer activity
    await ctx.db.insert("activityLog", {
      groupId,
      type: "admin_transferred",
      performedBy: currentUser._id,
      targetUserId: newAdminId,
      timestamp: Date.now(),
    });

    return { success: true, message: "Admin role transferred successfully" };
  },
});

// Leave group (admin can leave by transferring admin role first)
export const leaveGroup = mutation({
  args: { 
    groupId: v.id("groups"),
    newAdminId: v.optional(v.id("users")) // Required if current user is admin
  },
  handler: async (ctx, { groupId, newAdminId }) => {
    const currentUser = await getCurrentUser(ctx);
    
    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Check if user is a member
    const member = group.members.find(m => m.userId === currentUser._id);
    if (!member) {
      throw new Error("You are not a member of this group");
    }

    // If user is admin, they must transfer admin role first
    if (member.role === "admin") {
      if (!newAdminId) {
        throw new Error("Admins must transfer admin role before leaving. Please specify a new admin.");
      }

      // Transfer admin role first
      const newAdminMember = group.members.find(m => m.userId === newAdminId);
      if (!newAdminMember) {
        throw new Error("New admin must be a member of this group");
      }

      if (newAdminId === currentUser._id) {
        throw new Error("Cannot transfer admin role to yourself");
      }

      // Update member roles
      const updatedMembers = group.members.map(m => ({
        ...m,
        role: m.userId === newAdminId ? "admin" : "member"
      }));

      await ctx.db.patch(groupId, {
        members: updatedMembers
      });
    }

    // Remove current user from group
    const finalMembers = group.members.filter(m => m.userId !== currentUser._id);
    
    // If this was the last member, delete the group
    if (finalMembers.length === 0) {
      // Delete all related expenses
      const expenses = await ctx.db
        .query("expenses")
        .withIndex("by_group", (q) => q.eq("groupId", groupId))
        .collect();
      
      for (const expense of expenses) {
        await ctx.db.delete(expense._id);
      }

      // Delete all related settlements
      const settlements = await ctx.db
        .query("settlements")
        .filter((q) => q.eq(q.field("groupId"), groupId))
        .collect();
      
      for (const settlement of settlements) {
        await ctx.db.delete(settlement._id);
      }

      await ctx.db.delete(groupId);
      return { success: true, message: "Left group and group deleted (no members left)" };
    }

    // Update group members
    await ctx.db.patch(groupId, {
      members: finalMembers
    });

    // Clean up expenses where this user was involved
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .collect();

    for (const expense of expenses) {
      const updatedSplits = expense.splits.filter(split => split.userId !== currentUser._id);
      
      if (updatedSplits.length === 0) {
        // If no splits left, delete the expense
        await ctx.db.delete(expense._id);
      } else if (expense.paidByUserId === currentUser._id) {
        // If the leaving user was the payer, transfer to first remaining member
        await ctx.db.patch(expense._id, {
          paidByUserId: updatedSplits[0].userId,
          splits: updatedSplits.map(split => ({
            ...split,
            paid: split.userId === updatedSplits[0].userId
          }))
        });
      } else {
        // Just remove the user from splits
        await ctx.db.patch(expense._id, {
          splits: updatedSplits
        });
      }
    }

    // Delete settlements involving this user
    const settlements = await ctx.db
      .query("settlements")
      .filter((q) => q.eq(q.field("groupId"), groupId))
      .collect();

    for (const settlement of settlements) {
      if (settlement.paidByUserId === currentUser._id || settlement.receivedByUserId === currentUser._id) {
        await ctx.db.delete(settlement._id);
      }
    }

    return { success: true, message: "Left group successfully" };
  },
});

// Check if current user is admin of a group
export const isCurrentUserAdmin = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, { groupId }) => {
    const currentUser = await getCurrentUser(ctx);
    return await isUserAdmin(ctx, groupId, currentUser._id);
  },
});

// Add members to an existing group (admin only)
export const addMembersToGroup = mutation({
  args: { 
    groupId: v.id("groups"),
    newMemberIds: v.array(v.id("users"))
  },
  handler: async (ctx, { groupId, newMemberIds }) => {
    const currentUser = await getCurrentUser(ctx);
    
    // Check if user is admin
    if (!(await isUserAdmin(ctx, groupId, currentUser._id))) {
      throw new Error("Only group admins can add members");
    }

    const group = await ctx.db.get(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    // Filter out members who are already in the group
    const existingMemberIds = new Set(group.members.map(m => m.userId));
    const membersToAdd = newMemberIds.filter(id => !existingMemberIds.has(id));

    if (membersToAdd.length === 0) {
      throw new Error("All selected users are already members of this group");
    }

    // Validate that all new member users exist
    const validatedMembers = [];
    for (const userId of membersToAdd) {
      const user = await ctx.db.get(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      validatedMembers.push({
        userId,
        role: "member",
        joinedAt: Date.now(),
        addedBy: currentUser._id
      });
    }

    // Add new members to the group
    const updatedMembers = [...group.members, ...validatedMembers];
    await ctx.db.patch(groupId, {
      members: updatedMembers
    });

    // Log activity as a single bulk action
    const addedMemberIds = validatedMembers.map(m => m.userId);
    await ctx.db.insert("activityLog", {
      groupId,
      type: validatedMembers.length > 1 ? "members_added_bulk" : "member_added",
      performedBy: currentUser._id,
      targetUserId: validatedMembers.length === 1 ? addedMemberIds[0] : undefined,
      targetUserIds: validatedMembers.length > 1 ? addedMemberIds : undefined,
      timestamp: Date.now(),
      metadata: {
        memberCount: updatedMembers.length,
        addedCount: validatedMembers.length,
      }
    });

    // Send notifications to new members (via email action)
    // Schedule emails to be sent asynchronously
    for (const member of validatedMembers) {
      const user = await ctx.db.get(member.userId);
      if (user && user.email) {
        // Schedule email notification to run immediately
        await ctx.scheduler.runAfter(0, internal.email.sendGroupInviteNotification, {
          recipientEmail: user.email,
          recipientName: user.name,
          groupName: group.name,
          inviterName: currentUser.name,
        });
      }
    }

    return { 
      success: true, 
      message: `Successfully added ${membersToAdd.length} member(s)`,
      addedCount: membersToAdd.length
    };
  },
});

// Get activity log for a group
export const getGroupActivityLog = query({
  args: { 
    groupId: v.id("groups"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, { groupId, limit = 20 }) => {
    const currentUser = await getCurrentUser(ctx);
    
    // Check if user is a member of the group
    const group = await ctx.db.get(groupId);
    if (!group) {
      // Return empty array if group doesn't exist (e.g., was just deleted)
      return [];
    }

    if (!group.members.some(m => m.userId === currentUser._id)) {
      // Return empty array if user is not a member (e.g., just left the group)
      return [];
    }

    // Get activity logs
    const logs = await ctx.db
      .query("activityLog")
      .withIndex("by_group", (q) => q.eq("groupId", groupId))
      .order("desc")
      .take(limit);

    // Enrich logs with user details
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        const performer = await ctx.db.get(log.performedBy);
        const targetUser = log.targetUserId ? await ctx.db.get(log.targetUserId) : null;
        
        // For bulk actions, fetch all target users
        let targetUsers = null;
        if (log.targetUserIds && log.targetUserIds.length > 0) {
          const users = await Promise.all(
            log.targetUserIds.map(async (userId) => {
              const user = await ctx.db.get(userId);
              return user ? {
                id: user._id,
                name: user.name,
                imageUrl: user.imageUrl,
              } : null;
            })
          );
          targetUsers = users.filter(Boolean);
        }

        return {
          id: log._id,
          type: log.type,
          performer: {
            id: performer._id,
            name: performer.name,
            imageUrl: performer.imageUrl,
          },
          targetUser: targetUser ? {
            id: targetUser._id,
            name: targetUser.name,
            imageUrl: targetUser.imageUrl,
          } : null,
          targetUsers,
          timestamp: log.timestamp,
          metadata: log.metadata,
        };
      })
    );

    return enrichedLogs;
  },
});