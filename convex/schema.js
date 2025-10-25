import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),
    hasSeenWelcome: v.optional(v.boolean()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"])
    .searchIndex("search_name", { searchField: "name" })
    .searchIndex("search_email", { searchField: "email" }),

  // Expenses
  expenses: defineTable({
    description: v.string(),
    amount: v.number(),
    category: v.optional(v.string()),
    date: v.number(), // timestamp
    paidByUserId: v.id("users"), // Reference to users table
    splitType: v.string(), // "equal", "percentage", "exact"
    splits: v.array(
      v.object({
        userId: v.id("users"), // Reference to users table
        amount: v.number(), // amount owed by this user
        paid: v.boolean(),
      })
    ),
    groupId: v.optional(v.id("groups")), // null for one-on-one expenses
    createdBy: v.id("users"), // Reference to users table
  })
    .index("by_group", ["groupId"])
    .index("by_payer", ["paidByUserId"]) // NEW: Critical index for dashboard queries
    .index("by_user_and_group", ["paidByUserId", "groupId"])
    .index("by_date", ["date"]),

  // Settlements
  settlements: defineTable({
    amount: v.number(),
    note: v.optional(v.string()),
    date: v.number(), // timestamp
    paidByUserId: v.id("users"), // Reference to users table
    receivedByUserId: v.id("users"), // Reference to users table
    groupId: v.optional(v.id("groups")), // null for one-on-one settlements
    relatedExpenseIds: v.optional(v.array(v.id("expenses"))), // Which expenses this settlement covers
    createdBy: v.id("users"), // Reference to users table
  })
    .index("by_group", ["groupId"])
    .index("by_payer", ["paidByUserId"]) // NEW: Critical index for dashboard queries
    .index("by_receiver", ["receivedByUserId"]) // NEW: Critical index for dashboard queries
    .index("by_user_and_group", ["paidByUserId", "groupId"])
    .index("by_receiver_and_group", ["receivedByUserId", "groupId"])
    .index("by_date", ["date"]),

  // Groups
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"), // Reference to users table
    members: v.array(
      v.object({
        userId: v.id("users"), // Reference to users table
        role: v.string(), // "admin" or "member"
        joinedAt: v.number(),
        addedBy: v.optional(v.id("users")), // Who added this member (for tracking)
      })
    ),
  }),

  // Activity Log for groups (member additions, role changes, etc.)
  activityLog: defineTable({
    groupId: v.id("groups"),
    type: v.string(), // "member_added", "member_removed", "admin_transferred", "group_created", "members_added_bulk"
    performedBy: v.id("users"), // Who performed the action
    targetUserId: v.optional(v.id("users")), // User affected by the action (single action)
    targetUserIds: v.optional(v.array(v.id("users"))), // Users affected (bulk actions)
    timestamp: v.number(),
    metadata: v.optional(v.object({
      memberCount: v.optional(v.number()),
      newMembersCount: v.optional(v.number()),
      addedCount: v.optional(v.number()), // How many members were added in bulk
    })),
  })
    .index("by_group", ["groupId"])
    .index("by_timestamp", ["timestamp"]),
});