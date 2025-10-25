"use client";

import { useState, useEffect } from "react";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function AddMembersModal({ isOpen, onClose, groupId, currentMembers = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Get all contacts (for quick access)
  const { data: contactsData, isLoading: contactsLoading } = useConvexQuery(api.contacts.getAllContacts);
  
  // Search all users by name/email
  const { data: searchResults, isLoading: searchLoading } = useConvexQuery(
    api.users.searchUsers,
    searchTerm.length >= 2 ? { query: searchTerm } : "skip"
  );
  
  // Mutation to add members
  const addMembers = useConvexMutation(api.groups.addMembersToGroup);

  // Reset state when modal closes (using onOpenChange callback instead of useEffect)
  const handleOpenChange = (open) => {
    onOpenChange(open);
    if (!open) {
      // Reset state when closing
      setSearchTerm("");
      setSelectedMembers([]);
    }
  };

  // Filter out users who are already members
  const currentMemberIds = new Set(currentMembers.map(m => m.id));
  
  // Determine which users to show
  let availableUsers = [];
  let isLoading = false;

  if (searchTerm.length >= 2) {
    // Show search results from ALL users
    availableUsers = searchResults?.filter(user => !currentMemberIds.has(user.id)) || [];
    isLoading = searchLoading;
  } else {
    // Show contacts by default
    availableUsers = contactsData?.users?.filter(user => !currentMemberIds.has(user.id)) || [];
    isLoading = contactsLoading;
  }

  const filteredUsers = availableUsers;

  // Toggle user selection
  const toggleUser = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle add members
  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member to add");
      return;
    }

    try {
      const result = await addMembers.mutate({
        groupId,
        newMemberIds: selectedMembers
      });

      toast.success(result.message || "Members added successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add members: " + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Members to Group
          </DialogTitle>
          <DialogDescription>
            Search for any Equinex user by name or email to add them to this group.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email (min 2 characters)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Search hint */}
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="text-xs text-muted-foreground">
              Type at least 2 characters to search all Equinex users
            </p>
          )}
          
          {/* Results context */}
          {searchTerm.length >= 2 ? (
            <p className="text-xs text-muted-foreground">
              Searching all Equinex users...
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Showing your contacts. Search to find other Equinex users.
            </p>
          )}

          {/* Selected Count */}
          {selectedMembers.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedMembers.length} selected
              </Badge>
            </div>
          )}

          {/* User List */}
          <div className="border rounded-lg max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                {searchTerm.length >= 2 ? (
                  <>
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No users found</p>
                    <p className="text-sm mt-1">No Equinex users match &quot;{searchTerm}&quot;</p>
                  </>
                ) : availableUsers.length === 0 ? (
                  <>
                    <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">All contacts are already members</p>
                    <p className="text-sm mt-1">Search to find other Equinex users to add.</p>
                  </>
                ) : (
                  <>
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No contacts found</p>
                    <p className="text-sm mt-1">Try a different search term.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => {
                  const isSelected = selectedMembers.includes(user.id);
                  
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-accent ${
                        isSelected ? "bg-accent" : ""
                      }`}
                      onClick={() => toggleUser(user.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleUser(user.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddMembers}
            disabled={selectedMembers.length === 0 || addMembers.isPending}
          >
            {addMembers.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add {selectedMembers.length > 0 ? `${selectedMembers.length} ` : ""}Member
                {selectedMembers.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

