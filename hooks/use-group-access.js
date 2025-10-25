import { useConvexQuery } from "./use-convex-query";
import { api } from "@/convex/_generated/api";

// Utility function to check if user has access to a group
export function useGroupAccess(groupId) {
  const { data, isLoading, error } = useConvexQuery(api.groups.getGroupExpenses, {
    groupId,
  });

  return {
    data,
    isLoading,
    error,
    hasAccess: !data?.error,
    isGroupNotFound: data?.error === "GROUP_NOT_FOUND",
    isNotMember: data?.error === "NOT_MEMBER",
  };
}
