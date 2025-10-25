import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

/* ============================================================================
 *  MUTATION: createSettlement
 * -------------------------------------------------------------------------- */

export const createSettlement = mutation({
  args: {
    amount: v.number(), // must be > 0
    note: v.optional(v.string()),
    paidByUserId: v.id("users"),
    receivedByUserId: v.id("users"),
    groupId: v.optional(v.id("groups")), // null when settling one‑to‑one
    relatedExpenseIds: v.optional(v.array(v.id("expenses"))),
  },
  handler: async (ctx, args) => {
    // Use centralized getCurrentUser function
    const caller = await ctx.runQuery(internal.users.getCurrentUser);

    /* ── basic validation ────────────────────────────────────────────────── */
    if (args.amount <= 0) throw new Error("Amount must be positive");
    if (args.paidByUserId === args.receivedByUserId) {
      throw new Error("Payer and receiver cannot be the same user");
    }
    if (
      caller._id !== args.paidByUserId &&
      caller._id !== args.receivedByUserId
    ) {
      throw new Error("You must be either the payer or the receiver");
    }

    /* ── group check (if provided) ───────────────────────────────────────── */
    if (args.groupId) {
      const group = await ctx.db.get(args.groupId);
      if (!group) throw new Error("Group not found");

      const isMember = (uid) => group.members.some((m) => m.userId === uid);
      if (!isMember(args.paidByUserId) || !isMember(args.receivedByUserId)) {
        throw new Error("Both parties must be members of the group");
      }
    }

    /* ═══════════════════════════════════════════════════════════════════
     * Validate balance using SAME logic as dashboard/person/settlement pages
     * Calculate NET balance: How much does PAYER owe RECEIVER?
     * ═══════════════════════════════════════════════════════════════════ */
    
    // Get ALL expenses between these two users (including group expenses)
    // OPTIMIZED: Use indexes
    const expensesPayerPaid = await ctx.db
      .query("expenses")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", args.paidByUserId))
      .collect();

    const expensesReceiverPaid = await ctx.db
      .query("expenses")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", args.receivedByUserId))
      .collect();

    const expenses = [];
    const expenseIds = new Set();

    // From expenses payer paid, keep ones where receiver is in splits
    for (const exp of expensesPayerPaid) {
      if (exp.splits.some((s) => s.userId === args.receivedByUserId)) {
        expenses.push(exp);
        expenseIds.add(exp._id);
      }
    }

    // From expenses receiver paid, keep ones where payer is in splits
    for (const exp of expensesReceiverPaid) {
      if (!expenseIds.has(exp._id) && exp.splits.some((s) => s.userId === args.paidByUserId)) {
        expenses.push(exp);
      }
    }

    // Calculate NET: positive = payer owes receiver, negative = receiver owes payer
    let amountOwed = 0;

    for (const expense of expenses) {
      if (expense.paidByUserId === args.receivedByUserId) {
        // Receiver paid - payer may owe them
        const payerSplit = expense.splits.find(
          (s) => s.userId === args.paidByUserId && !s.paid
        );
        if (payerSplit) {
          amountOwed += payerSplit.amount; // Payer owes receiver (positive)
        }
      } else if (expense.paidByUserId === args.paidByUserId) {
        // Payer paid - receiver may owe them
        const receiverSplit = expense.splits.find(
          (s) => s.userId === args.receivedByUserId && !s.paid
        );
        if (receiverSplit) {
          amountOwed -= receiverSplit.amount; // Receiver owes payer (negative)
        }
      }
    }

    // Apply ALL existing settlements between them
    // OPTIMIZED: Use indexes
    const settlementsPayerPaidReceiver = await ctx.db
      .query("settlements")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", args.paidByUserId))
      .filter((q) => q.eq(q.field("receivedByUserId"), args.receivedByUserId))
      .collect();

    const settlementsReceiverPaidPayer = await ctx.db
      .query("settlements")
      .withIndex("by_payer", (q) => q.eq("paidByUserId", args.receivedByUserId))
      .filter((q) => q.eq(q.field("receivedByUserId"), args.paidByUserId))
      .collect();

    const settlements = [...settlementsPayerPaidReceiver, ...settlementsReceiverPaidPayer];

    for (const settlement of settlements) {
      if (settlement.paidByUserId === args.paidByUserId && settlement.receivedByUserId === args.receivedByUserId) {
        // Payer already paid receiver - reduces debt
        amountOwed -= settlement.amount;
      } else if (settlement.paidByUserId === args.receivedByUserId && settlement.receivedByUserId === args.paidByUserId) {
        // Receiver paid payer - increases debt
        amountOwed += settlement.amount;
      }
    }
    
    // Prevent creating settlement if there's no balance or if it's in wrong direction
    if (amountOwed <= 0) {
      if (amountOwed === 0) {
        throw new Error("Nothing to settle! All expenses between you are already balanced.");
      } else {
        throw new Error("Cannot settle in this direction. The balance is reversed - the other person owes you instead.");
      }
    }
    
    if (args.amount > amountOwed + 0.01) { // Small tolerance for rounding
      throw new Error(`Settlement amount ₹${args.amount.toFixed(2)} exceeds the actual balance ₹${amountOwed.toFixed(2)}. Please adjust the amount.`);
    }

    /* ── insert ──────────────────────────────────────────────────────────── */
    return await ctx.db.insert("settlements", {
      amount: args.amount,
      note: args.note,
      date: Date.now(), // server‑side timestamp
      paidByUserId: args.paidByUserId,
      receivedByUserId: args.receivedByUserId,
      groupId: args.groupId,
      relatedExpenseIds: args.relatedExpenseIds,
      createdBy: caller._id,
    });
  },
});

/* ============================================================================
 *  MUTATION: cleanupOrphanedSettlements
 *  Removes settlements that don't have any corresponding expenses
 * -------------------------------------------------------------------------- */

export const cleanupOrphanedSettlements = mutation({
  handler: async (ctx) => {
    const user = await ctx.runQuery(internal.users.getCurrentUser);
    
    // Get all settlements involving this user
    const allSettlements = await ctx.db.query("settlements").collect();
    const userSettlements = allSettlements.filter(
      s => s.paidByUserId === user._id || s.receivedByUserId === user._id
    );
    
    let deletedCount = 0;
    
    for (const settlement of userSettlements) {
      // Check if there are any expenses between these users
      let hasExpenses = false;
      
      if (settlement.groupId) {
        // Check group expenses
        const groupExpenses = await ctx.db
          .query("expenses")
          .withIndex("by_group", (q) => q.eq("groupId", settlement.groupId))
          .collect();
        hasExpenses = groupExpenses.length > 0;
      } else {
        // Check 1-to-1 expenses
        const expenses = (await ctx.db.query("expenses").collect()).filter(
          e => !e.groupId && (
            (e.paidByUserId === settlement.paidByUserId && e.splits.some(s => s.userId === settlement.receivedByUserId)) ||
            (e.paidByUserId === settlement.receivedByUserId && e.splits.some(s => s.userId === settlement.paidByUserId))
          )
        );
        hasExpenses = expenses.length > 0;
      }
      
      // If no expenses exist, delete this orphaned settlement
      if (!hasExpenses) {
        await ctx.db.delete(settlement._id);
        deletedCount++;
      }
    }
    
    return { 
      success: true, 
      deletedCount,
      message: deletedCount > 0 
        ? `Cleaned up ${deletedCount} orphaned settlement(s)` 
        : "No orphaned settlements found"
    };
  },
});

/* ============================================================================
 *  QUERY: getSettlementData
 *  Returns the balances relevant for a page routed as:
 *      /settlements/[entityType]/[entityId]
 *  where entityType ∈ {"user","group"}
 * -------------------------------------------------------------------------- */

export const getSettlementData = query({
  args: {
    entityType: v.string(), // "user"  | "group"
    entityId: v.string(), // Convex _id (string form) of the user or group
  },
  handler: async (ctx, args) => {
    // Use centralized getCurrentUser function
    const me = await ctx.runQuery(internal.users.getCurrentUser);

    if (args.entityType === "user") {
      /* ═══════════════════════════════════════════════════════════════════
       * USER-TO-USER SETTLEMENT (using same logic as dashboard/person page)
       * ═══════════════════════════════════════════════════════════════════ */
      const other = await ctx.db.get(args.entityId);
      if (!other) throw new Error("User not found");

      // STEP 1: Get ALL expenses where BOTH users are involved (including groups)
      // OPTIMIZED: Use indexes
      const expensesIPaid = await ctx.db
        .query("expenses")
        .withIndex("by_payer", (q) => q.eq("paidByUserId", me._id))
        .collect();

      const expensesTheyPaid = await ctx.db
        .query("expenses")
        .withIndex("by_payer", (q) => q.eq("paidByUserId", other._id))
        .collect();

      const expenses = [];
      const expenseIds = new Set();

      // From expenses I paid, keep ones where they're in splits
      for (const exp of expensesIPaid) {
        if (exp.splits.some((s) => s.userId === other._id)) {
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

      // STEP 2: Calculate NET balance from expenses
      let netBalance = 0;

      for (const expense of expenses) {
        if (expense.paidByUserId === me._id) {
          // I paid - they may owe me
          const theirSplit = expense.splits.find(
            (s) => s.userId === other._id && !s.paid
          );
          if (theirSplit) {
            netBalance += theirSplit.amount; // They owe me (positive)
          }
        } else if (expense.paidByUserId === other._id) {
          // They paid - I may owe them
          const mySplit = expense.splits.find(
            (s) => s.userId === me._id && !s.paid
          );
          if (mySplit) {
            netBalance -= mySplit.amount; // I owe them (negative)
          }
        }
      }

      // STEP 3: Apply ALL settlements between us (including group settlements)
      // OPTIMIZED: Use indexes
      const settlementsIPaidThem = await ctx.db
        .query("settlements")
        .withIndex("by_payer", (q) => q.eq("paidByUserId", me._id))
        .filter((q) => q.eq(q.field("receivedByUserId"), other._id))
        .collect();

      const settlementsTheyPaidMe = await ctx.db
        .query("settlements")
        .withIndex("by_payer", (q) => q.eq("paidByUserId", other._id))
        .filter((q) => q.eq(q.field("receivedByUserId"), me._id))
        .collect();

      const settlements = [...settlementsIPaidThem, ...settlementsTheyPaidMe];

      for (const settlement of settlements) {
        if (settlement.paidByUserId === me._id) {
          // I paid them - reduces what I owe (increases netBalance)
          netBalance += settlement.amount;
        } else {
          // They paid me - reduces what they owe (decreases netBalance)
          netBalance -= settlement.amount;
        }
      }

      // STEP 4: Return result
      // Positive netBalance = they owe me
      // Negative netBalance = I owe them
      return {
        type: "user",
        counterpart: {
          userId: other._id,
          name: other.name,
          email: other.email,
          imageUrl: other.imageUrl,
        },
        youAreOwed: netBalance > 0 ? netBalance : 0,
        youOwe: netBalance < 0 ? Math.abs(netBalance) : 0,
        netBalance, // + => you should receive, − => you should pay
      };
    } else if (args.entityType === "group") {
      /* ──────────────────────────────────────────────────────── group page */
      const group = await ctx.db.get(args.entityId);
      if (!group) throw new Error("Group not found");

      const isMember = group.members.some((m) => m.userId === me._id);
      if (!isMember) throw new Error("You are not a member of this group");

      // ---------- expenses for this group
      const expenses = await ctx.db
        .query("expenses")
        .withIndex("by_group", (q) => q.eq("groupId", group._id))
        .collect();

      // ---------- initialise per‑member tallies
      const balances = {};
      group.members.forEach((m) => {
        if (m.userId !== me._id) balances[m.userId] = { owed: 0, owing: 0 };
      });

      // ---------- apply expenses
      for (const exp of expenses) {
        if (exp.paidByUserId === me._id) {
          // I paid; others may owe me
          exp.splits.forEach((split) => {
            if (split.userId !== me._id && !split.paid) {
              balances[split.userId].owed += split.amount;
            }
          });
        } else if (balances[exp.paidByUserId]) {
          // Someone else in the group paid; I may owe them
          const split = exp.splits.find((s) => s.userId === me._id && !s.paid);
          if (split) balances[exp.paidByUserId].owing += split.amount;
        }
      }

      // ---------- apply settlements within the group
      const settlements = await ctx.db
        .query("settlements")
        .filter((q) => q.eq(q.field("groupId"), group._id))
        .collect();

      for (const st of settlements) {
        // we only care if ONE side is me
        if (st.paidByUserId === me._id && balances[st.receivedByUserId]) {
          balances[st.receivedByUserId].owing = Math.max(
            0,
            balances[st.receivedByUserId].owing - st.amount
          );
        }
        if (st.receivedByUserId === me._id && balances[st.paidByUserId]) {
          balances[st.paidByUserId].owed = Math.max(
            0,
            balances[st.paidByUserId].owed - st.amount
          );
        }
      }

      // ---------- shape result list
      const members = await Promise.all(
        Object.keys(balances).map((id) => ctx.db.get(id))
      );

      const list = Object.keys(balances).map((uid) => {
        const m = members.find((u) => u && u._id === uid);
        const { owed, owing } = balances[uid];
        return {
          userId: uid,
          name: m?.name || "Unknown",
          imageUrl: m?.imageUrl,
          youAreOwed: owed,
          youOwe: owing,
          netBalance: owed - owing,
        };
      });

      return {
        type: "group",
        group: {
          id: group._id,
          name: group.name,
          description: group.description,
        },
        balances: list,
      };
    }

    /* ── unsupported entityType ──────────────────────────────────────────── */
    throw new Error("Invalid entityType; expected 'user' or 'group'");
  },
});