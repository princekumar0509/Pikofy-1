"use client";

import { useState, useEffect } from "react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GroupSelector({ onChange }) {
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // Single query to get all data we need
  const { data, isLoading } = useConvexQuery(
    api.groups.getGroupOrMembers,
    selectedGroupId ? { groupId: selectedGroupId } : {}
  );

  // When group data changes, notify parent
  useEffect(() => {
    if (data?.selectedGroup && onChange) {
      onChange(data.selectedGroup);
    }
  }, [data, onChange]);

  const handleGroupChange = (groupId) => {
    setSelectedGroupId(groupId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  if (!data?.groups || data.groups.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>You need to create a group first before adding a group expense.</span>
      </div>
    );
  }

  // Get the selected group to display
  const selectedGroupObj = data.groups.find(g => g.id === selectedGroupId);

  return (
    <div>
      <Select value={selectedGroupId} onValueChange={handleGroupChange}>
        <SelectTrigger className="w-full h-11 border-2 focus:border-primary transition-colors">
          <SelectValue placeholder="Select a group">
            {selectedGroupObj && (
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{selectedGroupObj.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({selectedGroupObj.memberCount} members)
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {data.groups.map((group) => (
            <SelectItem 
              key={group.id} 
              value={group.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2.5 py-1">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{group.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({group.memberCount} members)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading && selectedGroupId && (
        <div className="mt-3">
          <BarLoader width={"100%"} color="#36d7b7" />
        </div>
      )}
    </div>
  );
}