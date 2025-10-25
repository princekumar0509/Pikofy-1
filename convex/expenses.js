import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Create a new expense
export const createExpense = mutation({
  args: {
    description: v.string(),
    amount: v.number(),
    category: v.optional(v.string()),
    date: v.number(), // timestamp
    paidByUserId: v.id("users"),
    splitType: v.string(), // "equal", "percentage", "exact"
    splits: v.array(
      v.object({
        userId: v.id("users"),
        amount: v.number(),
        paid: v.boolean(),
      })
    ),
    groupId: v.optional(v.id("groups")),
  },
  handler: async (ctx, args) => {
    // Use centralized getCurrentUser function
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // If there's a group, verify the user is a member
    if (args.groupId) {
      const group = await ctx.db.get(args.groupId);
      if (!group) {
        throw new Error("Group not found");
      }

      const isMember = group.members.some(
        (member) => member.userId === user._id
      );
      if (!isMember) {
        throw new Error("You are not a member of this group");
      }
    }

    // Verify that splits add up to the total amount (with small tolerance for floating point issues)
    const totalSplitAmount = args.splits.reduce(
      (sum, split) => sum + split.amount,
      0
    );
    const tolerance = 0.01; // Allow for small rounding errors
    if (Math.abs(totalSplitAmount - args.amount) > tolerance) {
      throw new Error("Split amounts must add up to the total expense amount");
    }

    // Create the expense
    const expenseId = await ctx.db.insert("expenses", {
      description: args.description,
      amount: args.amount,
      category: args.category || "Other",
      date: args.date,
      paidByUserId: args.paidByUserId,
      splitType: args.splitType,
      splits: args.splits,
      groupId: args.groupId,
      createdBy: user._id,
    });

    return expenseId;
  },
});

// ----------- Expenses Page -----------

// Get expenses between current user and a specific person
export const getExpensesBetweenUsers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const me = await ctx.runQuery(internal.users.getCurrentUser);
    if (me._id === userId) throw new Error("Cannot query yourself");

    /* ═══════════════════════════════════════════════════════════════════
     * STEP 1: Get ALL expenses where BOTH users are involved
     * (either as payer or participant, including group expenses)
     * OPTIMIZED: Use index for payer queries
     * ═══════════════════════════════════════════════════════════════════ */
    // Get expenses where I paid (uses index!)
    const expensesIPaid = await ctx.db
      .query("expenses")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", me._id))
      .collect();

    // Get expenses where they paid (uses index!)
    const expensesTheyPaid = await ctx.db
      .query("expenses")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", userId))
      .collect();

    // Filter to only expenses where BOTH are involved
    const expenses = [];
    const expenseIds = new Set();

    // From expenses I paid, keep ones where they're in splits
    for (const exp of expensesIPaid) {
      if (exp.splits.some((s) => s.userId === userId)) {
        expenses.push(exp);
        expenseIds.add(exp._id);
      }
    }

    // From expenses they paid, keep ones where I'm in splits
    for (const exp of expensesTheyPaid) {
      if (!expenseIds.has(exp._id) && exp.splits.some((s) => s.userId === me._id)) {
        expenses.push(exp);
      }
    }

    expenses.sort((a, b) => b.date - a.date);

    /* ═══════════════════════════════════════════════════════════════════
     * STEP 2: Calculate NET balance (same logic as dashboard)
     * Positive = They owe me, Negative = I owe them
     * ═══════════════════════════════════════════════════════════════════ */
    let balance = 0;

    for (const expense of expenses) {
      if (expense.paidByUserId === me._id) {
        // I paid - they may owe me
        const theirSplit = expense.splits.find(
          (s) => s.userId === userId && !s.paid
        );
        if (theirSplit) {
          balance += theirSplit.amount; // They owe me (positive)
        }
      } else if (expense.paidByUserId === userId) {
        // They paid - I may owe them
        const mySplit = expense.splits.find(
          (s) => s.userId === me._id && !s.paid
        );
        if (mySplit) {
          balance -= mySplit.amount; // I owe them (negative)
        }
      }
    }

    /* ═══════════════════════════════════════════════════════════════════
     * STEP 3: Apply settlements (same logic as dashboard)
     * OPTIMIZED: Use indexes
     * ═══════════════════════════════════════════════════════════════════ */
    // Get settlements where I paid them (uses index!)
    const settlementsIPaidThem = await ctx.db
      .query("settlements")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", me._id))
      .filter((q) => q.eq(q.field("receivedByUserId"), userId))
      .collect();

    // Get settlements where they paid me (uses index!)
    const settlementsTheyPaidMe = await ctx.db
      .query("settlements")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", userId))
      .filter((q) => q.eq(q.field("receivedByUserId"), me._id))
      .collect();

    const settlements = [...settlementsIPaidThem, ...settlementsTheyPaidMe];
    settlements.sort((a, b) => b.date - a.date);

    for (const settlement of settlements) {
      if (settlement.paidByUserId === me._id) {
        // I paid them - reduces what I owe (increases balance)
        balance += settlement.amount;
      } else {
        // They paid me - reduces what they owe (decreases balance)
        balance -= settlement.amount;
      }
    }

    /* ═══════════════════════════════════════════════════════════════════
     * STEP 4: Return result
     * ═══════════════════════════════════════════════════════════════════ */
    const other = await ctx.db.get(userId);
    if (!other) throw new Error("User not found");

    return {
      expenses,
      settlements,
      otherUser: {
        id: other._id,
        name: other.name,
        email: other.email,
        imageUrl: other.imageUrl,
      },
      balance, // Positive = they owe me, Negative = I owe them
    };
  },
});

// Delete an expense
export const deleteExpense = mutation({
  args: {
    expenseId: v.id("expenses"),
  },
  handler: async (ctx, args) => {
    // Get the current user
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // Get the expense
    const expense = await ctx.db.get(args.expenseId);
    if (!expense) {
      throw new Error("Expense not found");
    }

    // Check if user is authorized to delete this expense
    // Only the creator of the expense or the payer can delete it
    if (expense.createdBy !== user._id && expense.paidByUserId !== user._id) {
      throw new Error("You don't have permission to delete this expense");
    }

    // Delete the expense first
    await ctx.db.delete(args.expenseId);

    // Now check if there are any remaining expenses between the involved users
    const involvedUserIds = new Set(expense.splits.map(s => s.userId));
    involvedUserIds.add(expense.paidByUserId);

    // Get all remaining expenses involving these users (same group or 1-to-1)
    const allExpenses = await ctx.db.query("expenses").collect();
    const remainingExpenses = allExpenses.filter(e => {
      // Check if this expense involves the same users
      if (expense.groupId) {
        // For group expenses, check same group
        return e.groupId === expense.groupId;
      } else {
        // For 1-to-1, check if same pair of users
        const eUsers = new Set(e.splits.map(s => s.userId));
        eUsers.add(e.paidByUserId);
        
        // Check if it's the same pair of users
        return eUsers.size === involvedUserIds.size && 
               [...involvedUserIds].every(id => eUsers.has(id));
      }
    });

    // If NO remaining expenses between these users, delete ALL their settlements
    if (remainingExpenses.length === 0) {
    const allSettlements = await ctx.db.query("settlements").collect();

      const settlementsToDelete = allSettlements.filter(settlement => {
        if (expense.groupId) {
          // Delete all settlements for this group
          return settlement.groupId === expense.groupId;
        } else {
          // Delete 1-to-1 settlements between these users
          return !settlement.groupId &&
                 ((settlement.paidByUserId === expense.paidByUserId && involvedUserIds.has(settlement.receivedByUserId)) ||
                  (settlement.receivedByUserId === expense.paidByUserId && involvedUserIds.has(settlement.paidByUserId)) ||
                  (involvedUserIds.has(settlement.paidByUserId) && involvedUserIds.has(settlement.receivedByUserId)));
        }
      });

      for (const settlement of settlementsToDelete) {
        await ctx.db.delete(settlement._id);
      }
    }

    return { success: true };
  },
});