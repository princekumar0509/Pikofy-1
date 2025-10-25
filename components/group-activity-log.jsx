"use client";

import { useState } from "react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  UserMinus, 
  Crown, 
  Users, 
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const activityTypeConfig = {
  group_created: {
    icon: Users,
    label: "Group Created",
    color: "bg-blue-500",
    description: (log) => `created this group with ${log.metadata?.memberCount || 0} members`,
  },
  member_added: {
    icon: UserPlus,
    label: "Member Added",
    color: "bg-green-500",
    description: (log) => `added ${log.targetUser?.name || "a member"} to the group`,
  },
  members_added_bulk: {
    icon: UserPlus,
    label: "Members Added",
    color: "bg-green-500",
    description: (log) => `added ${log.metadata?.addedCount || log.targetUsers?.length || 0} members to the group`,
    showTargetUsers: true, // Special flag to show list of users
  },
  member_removed: {
    icon: UserMinus,
    label: "Member Removed",
    color: "bg-orange-500",
    description: (log) => `removed ${log.targetUser?.name || "a member"} from the group`,
  },
  admin_transferred: {
    icon: Crown,
    label: "Admin Transferred",
    color: "bg-purple-500",
    description: (log) => `transferred admin role to ${log.targetUser?.name || "another member"}`,
  },
};

export function GroupActivityLog({ groupId, initialLimit = 2 }) {
  const [showAll, setShowAll] = useState(false);
  const limit = showAll ? 50 : initialLimit; // Fetch 50 when showing all
  
  const { data: activityLogs, isLoading } = useConvexQuery(
    api.groups.getGroupActivityLog,
    { groupId, limit }
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activityLogs || activityLogs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No activity yet</p>
            <p className="text-sm mt-1">Group activities will appear here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityLogs.map((log) => {
            const config = activityTypeConfig[log.type];
            if (!config) return null;

            const Icon = config.icon;
            const timeAgo = formatDistanceToNow(log.timestamp, { addSuffix: true });

            return (
              <div key={log.id} className="flex items-start gap-3">
                {/* Activity Icon */}
                <div className={`p-2 rounded-full ${config.color} bg-opacity-10 flex-shrink-0`}>
                  <Icon className={`h-4 w-4 ${config.color.replace('bg-', 'text-')}`} />
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Performer Avatar */}
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={log.performer.imageUrl} />
                          <AvatarFallback className="text-xs">
                            {log.performer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Activity Description */}
                        <p className="text-sm">
                          <span className="font-medium">{log.performer.name}</span>
                          {" "}
                          <span className="text-muted-foreground">
                            {config.description(log)}
                          </span>
                        </p>
                      </div>

                      {/* Timestamp */}
                      <p className="text-xs text-muted-foreground mt-1 ml-8">
                        {timeAgo}
                      </p>
                    </div>

                    {/* Activity Type Badge */}
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {config.label}
                    </Badge>
                  </div>

                  {/* Show list of added users for bulk actions */}
                  {config.showTargetUsers && log.targetUsers && log.targetUsers.length > 0 && (
                    <div className="mt-2 ml-8 flex flex-wrap gap-1">
                      {log.targetUsers.slice(0, 3).map((user) => (
                        <Badge key={user.id} variant="secondary" className="text-xs">
                          {user.name}
                        </Badge>
                      ))}
                      {log.targetUsers.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{log.targetUsers.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Additional Metadata */}
                  {log.metadata && log.metadata.memberCount && (log.type === "member_added" || log.type === "members_added_bulk") && (
                    <p className="text-xs text-muted-foreground mt-1 ml-8">
                      Group now has {log.metadata.memberCount} members
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More button */}
        {!showAll && activityLogs.length >= initialLimit && (
          <div className="mt-6 pt-4 border-t text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAll(true)}
              className="w-full"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              Load More Activities
            </Button>
          </div>
        )}

        {/* Show Less button */}
        {showAll && (
          <div className="mt-6 pt-4 border-t text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAll(false)}
              className="w-full"
            >
              <ChevronUp className="h-4 w-4 mr-2" />
              Show Less
            </Button>
            {activityLogs.length >= limit && (
              <p className="text-xs text-muted-foreground mt-2">
                Showing last {limit} activities
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

