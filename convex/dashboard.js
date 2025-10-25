import { query } from "./_generated/server";
import { internal } from "./_generated/api";

// Get user balances (includes BOTH 1-to-1 AND group expenses)
export const getUserBalances = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    /* ═══════════════════════════════════════════════════════════════════
     * STEP 1: Get ALL expenses where I'm involved (payer or participant)
     * OPTIMIZED: Use index to fetch only expenses I paid, then filter for splits
     * ═══════════════════════════════════════════════════════════════════ */
    // Get expenses where I'm the payer (uses index!)
    const expensesIPaid = await ctx.db
      .query("expenses")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", user._id))
      .collect();

    // Get ALL expenses and filter for ones where I'm in the splits
    // (Unfortunately, Convex doesn't support indexing array fields, so we need this)
    const allExpenses = await ctx.db.query("expenses").collect();
    const expensesImIn = allExpenses.filter((e) =>
      e.splits.some((s) => s.userId === user._id && e.paidByUserId !== user._id)
    );

    // Combine both lists (remove duplicates)
    const expenseIds = new Set();
    const expenses = [];
    
    for (const exp of [...expensesIPaid, ...expensesImIn]) {
      if (!expenseIds.has(exp._id)) {
        expenseIds.add(exp._id);
        expenses.push(exp);
      }
    }

    /* ═══════════════════════════════════════════════════════════════════
     * STEP 2: Calculate NET balance per user from expenses
     * NET = What they owe me - What I owe them
     * Positive NET = They owe me, Negative NET = I owe them
     * ═══════════════════════════════════════════════════════════════════ */
    const balanceByUser = {};

    for (const expense of expenses) {
      if (expense.paidByUserId === user._id) {
        // I paid this expense - others may owe me
        for (const split of expense.splits) {
          if (split.userId === user._id) continue; // Skip my own split
          if (split.paid) continue; // Skip already settled splits
          
          // They owe me: increase their balance (positive)
          if (!balanceByUser[split.userId]) {
            balanceByUser[split.userId] = 0;
          }
          balanceByUser[split.userId] += split.amount;
        }
      } else {
        // Someone else paid - I may owe them
        const mySplit = expense.splits.find((s) => s.userId === user._id);
        if (mySplit && !mySplit.paid) {
          // I owe them: decrease their balance (negative)
          if (!balanceByUser[expense.paidByUserId]) {
            balanceByUser[expense.paidByUserId] = 0;
          }
          balanceByUser[expense.paidByUserId] -= mySplit.amount;
        }
      }
    }

    /* ═══════════════════════════════════════════════════════════════════
     * STEP 3: Apply settlements to adjust balances
     * Settlement from me to them = reduces what I owe (increases their NET)
     * Settlement from them to me = reduces what they owe (decreases their NET)
     * OPTIMIZED: Use indexes to fetch only relevant settlements
     * ═══════════════════════════════════════════════════════════════════ */
    // Get settlements where I'm the payer (uses index!)
    const settlementsIPaid = await ctx.db
      .query("settlements")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", user._id))
      .collect();

    // Get settlements where I'm the receiver (uses index!)
    const settlementsIReceived = await ctx.db
      .query("settlements")
      .withIndex("by_receiver", (q) => q.eq("receivedByUserId", user._id))
      .collect();

    // Combine both lists
    const settlements = [...settlementsIPaid, ...settlementsIReceived];

    for (const settlement of settlements) {
      if (settlement.paidByUserId === user._id) {
        // I paid them a settlement
        // This REDUCES what I owe them (or increases what they owe me)
        // Effect: INCREASE their NET balance
        if (!balanceByUser[settlement.receivedByUserId]) {
          balanceByUser[settlement.receivedByUserId] = 0;
        }
        balanceByUser[settlement.receivedByUserId] += settlement.amount;
      } else if (settlement.receivedByUserId === user._id) {
        // They paid me a settlement
        // This REDUCES what they owe me (or increases what I owe them)
        // Effect: DECREASE their NET balance
        if (!balanceByUser[settlement.paidByUserId]) {
          balanceByUser[settlement.paidByUserId] = 0;
        }
        balanceByUser[settlement.paidByUserId] -= settlement.amount;
      }
    }

    /* ═══════════════════════════════════════════════════════════════════
     * STEP 4: Build UI lists and calculate totals
     * ═══════════════════════════════════════════════════════════════════ */
    const youOweList = [];
    const youAreOwedByList = [];

    for (const [userId, netBalance] of Object.entries(balanceByUser)) {
      // Skip if balance is effectively zero (handle floating point errors)
      if (Math.abs(netBalance) < 0.01) continue;

      const otherUser = await ctx.db.get(userId);
      if (!otherUser) continue; // Skip deleted users

      const userBalance = {
        userId,
        name: otherUser.name ?? "Unknown",
        imageUrl: otherUser.imageUrl,
        amount: Math.abs(netBalance),
      };

      if (netBalance > 0) {
        // Positive balance = they owe me
        youAreOwedByList.push(userBalance);
      } else {
        // Negative balance = I owe them
        youOweList.push(userBalance);
      }
    }

    // Sort by amount (highest first)
    youOweList.sort((a, b) => b.amount - a.amount);
    youAreOwedByList.sort((a, b) => b.amount - a.amount);

    // Calculate global totals (sum of lists)
    const youOwe = youOweList.reduce((sum, item) => sum + item.amount, 0);
    const youAreOwed = youAreOwedByList.reduce((sum, item) => sum + item.amount, 0);
    const totalBalance = youAreOwed - youOwe;

    return {
      youOwe,
      youAreOwed,
      totalBalance,
      oweDetails: { youOwe: youOweList, youAreOwedBy: youAreOwedByList },
    };
  },
});

// Get total spent in the current year
export const getTotalSpent = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // Get start of current year timestamp
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();

    // Get all expenses for the current year
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_date", (q) => q.gte("date", startOfYear))
      .collect();

    // Filter for expenses where user is involved
    const userExpenses = expenses.filter(
      (expense) =>
        expense.paidByUserId === user._id ||
        expense.splits.some((split) => split.userId === user._id)
    );

    // Calculate total spent (personal share only)
    let totalSpent = 0;

    userExpenses.forEach((expense) => {
      const userSplit = expense.splits.find(
        (split) => split.userId === user._id
      );
      if (userSplit) {
        totalSpent += userSplit.amount;
      }
    });

    return totalSpent;
  },
});

// Get monthly spending
export const getMonthlySpending = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // Get current year
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1).getTime();

    // Get all expenses for current year
    const allExpenses = await ctx.db
      .query("expenses")
      .withIndex("by_date", (q) => q.gte("date", startOfYear))
      .collect();

    // Filter for expenses where user is involved
    const userExpenses = allExpenses.filter(
      (expense) =>
        expense.paidByUserId === user._id ||
        expense.splits.some((split) => split.userId === user._id)
    );

    // Group expenses by month
    const monthlyTotals = {};

    // Initialize all months with zero
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, i, 1);
      monthlyTotals[monthDate.getTime()] = 0;
    }

    // Sum up expenses by month
    userExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ).getTime();

      // Get user's share of this expense
      const userSplit = expense.splits.find(
        (split) => split.userId === user._id
      );
      if (userSplit) {
        monthlyTotals[monthStart] =
          (monthlyTotals[monthStart] || 0) + userSplit.amount;
      }
    });

    // Convert to array format
    const result = Object.entries(monthlyTotals).map(([month, total]) => ({
      month: parseInt(month),
      total,
    }));

    // Sort by month (ascending)
    result.sort((a, b) => a.month - b.month);

    return result;
  },
});

// Get groups for the current user
export const getUserGroups = query({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);

    // Get all groups
    const allGroups = await ctx.db.query("groups").collect();

    // Filter for groups where the user is a member
    const groups = allGroups.filter((group) =>
      group.members.some((member) => member.userId === user._id)
    );

    // Calculate balances for each group
    const enhancedGroups = await Promise.all(
      groups.map(async (group) => {
        // Get all expenses for this group
        const expenses = await ctx.db
          .query("expenses")
          .withIndex("by_group", (q) => q.eq("groupId", group._id))
          .collect();

        let balance = 0;

        expenses.forEach((expense) => {
          if (expense.paidByUserId === user._id) {
            // User paid for others
            expense.splits.forEach((split) => {
              if (split.userId !== user._id && !split.paid) {
                balance += split.amount;
              }
            });
          } else {
            // User owes someone else
            const userSplit = expense.splits.find(
              (split) => split.userId === user._id
            );
            if (userSplit && !userSplit.paid) {
              balance -= userSplit.amount;
            }
          }
        });

        // Apply settlements
        const settlements = await ctx.db
          .query("settlements")
          .filter((q) =>
            q.and(
              q.eq(q.field("groupId"), group._id),
              q.or(
                q.eq(q.field("paidByUserId"), user._id),
                q.eq(q.field("receivedByUserId"), user._id)
              )
            )
          )
          .collect();

        settlements.forEach((settlement) => {
          if (settlement.paidByUserId === user._id) {
            // User paid someone
            balance += settlement.amount;
          } else {
            // Someone paid the user
            balance -= settlement.amount;
          }
        });

        return {
          ...group,
          id: group._id,
          balance,
        };
      })
    );

    return enhancedGroups;
  },
});