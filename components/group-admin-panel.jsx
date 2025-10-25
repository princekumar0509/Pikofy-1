"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  MoreHorizontal, 
  UserMinus, 
  Crown, 
  LogOut, 
  Trash2,
  Settings,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";
import { GroupMemberActions } from "./group-member-actions.jsx";
import { AddMembersModal } from "./add-members-modal.jsx";

export function GroupManagementPanel({ groupId, members }) {
  const router = useRouter();
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUserPublic);
  
  // Mutations
  const deleteGroup = useConvexMutation(api.groups.deleteGroup);
  const removeMember = useConvexMutation(api.groups.removeMember);
  const transferAdminRole = useConvexMutation(api.groups.transferAdminRole);
  const leaveGroup = useConvexMutation(api.groups.leaveGroup);

  // State for dialogs
  const [transferAdminOpen, setTransferAdminOpen] = useState(false);
  const [leaveGroupOpen, setLeaveGroupOpen] = useState(false);
  const [addMembersOpen, setAddMembersOpen] = useState(false);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const [removeMemberDialogs, setRemoveMemberDialogs] = useState({});
  const [selectedNewAdmin, setSelectedNewAdmin] = useState("");

  // Check if current user is admin
  const currentUserMember = members?.find(m => m.id === currentUser?._id);
  const isAdmin = currentUserMember?.role === "admin";

  // If not admin, show member actions instead
  if (!isAdmin) {
    return <GroupMemberActions groupId={groupId} />;
  }

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup.mutate({ groupId });
      toast.success("Group deleted successfully! Redirecting to dashboard...");
      setDeleteGroupOpen(false);
      // Redirect to dashboard with a small delay to show the success message
      setTimeout(() => {
        router.push("/dashboard?message=group_deleted");
      }, 1500);
    } catch (error) {
      toast.error("Failed to delete group: " + error.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await removeMember.mutate({ groupId, memberId });
      toast.success("Member removed successfully");
      setRemoveMemberDialogs({ ...removeMemberDialogs, [memberId]: false });
    } catch (error) {
      toast.error("Failed to remove member: " + error.message);
    }
  };

  const openRemoveMemberDialog = (memberId) => {
    setRemoveMemberDialogs({ ...removeMemberDialogs, [memberId]: true });
  };

  const closeRemoveMemberDialog = (memberId) => {
    setRemoveMemberDialogs({ ...removeMemberDialogs, [memberId]: false });
  };

  const handleTransferAdmin = async () => {
    if (!selectedNewAdmin) {
      toast.error("Please select a new admin");
      return;
    }

    try {
      await transferAdminRole.mutate({ groupId, newAdminId: selectedNewAdmin });
      toast.success("Admin role transferred successfully");
      setTransferAdminOpen(false);
      setSelectedNewAdmin("");
    } catch (error) {
      toast.error("Failed to transfer admin role: " + error.message);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup.mutate({ groupId, newAdminId: selectedNewAdmin });
      toast.success("Successfully left the group and transferred admin role! Redirecting...");
      // Redirect to dashboard with a small delay to show the success message
      setTimeout(() => {
        router.push("/dashboard?message=left_group");
      }, 1500);
      setLeaveGroupOpen(false);
    } catch (error) {
      toast.error("Failed to leave group: " + error.message);
    }
  };

  // Get members that can be made admin (excluding current user)
  const eligibleMembers = members?.filter(m => m.id !== currentUser?._id) || [];

  return (
    <>
      <AddMembersModal 
        isOpen={addMembersOpen}
        onClose={() => setAddMembersOpen(false)}
        groupId={groupId}
        currentMembers={members}
      />
      
      <Card className="border-destructive/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Group Administration
          </CardTitle>
        </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Members Button */}
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => setAddMembersOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Members
        </Button>

        {/* Members Management */}
        <div>
          <h4 className="font-medium mb-3">Manage Members</h4>
          <div className="space-y-2">
            {members?.map((member) => {
              const isCurrentUser = member.id === currentUser?._id;
              const isMemberAdmin = member.role === "admin";

              return (
                <div key={member.id} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.imageUrl} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {isCurrentUser ? "You" : member.name}
                        </span>
                        {isCurrentUser && (
                          <Badge variant="outline" className="text-xs py-0 h-5">
                            You
                          </Badge>
                        )}
                        {isMemberAdmin && (
                          <Badge variant="default" className="text-xs py-0 h-5">
                            <Crown className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!isCurrentUser && (
                    <AlertDialog open={removeMemberDialogs[member.id]} onOpenChange={(open) => open ? openRemoveMemberDialog(member.id) : closeRemoveMemberDialog(member.id)}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Member</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove {member.name} from this group? 
                            This action cannot be undone and will delete all their related expenses and settlements.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => closeRemoveMemberDialog(member.id)}>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveMember(member.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove Member
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="space-y-3">
          <h4 className="font-medium">Admin Actions</h4>
          
          {/* Transfer Admin Role */}
          <Dialog open={transferAdminOpen} onOpenChange={setTransferAdminOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Crown className="h-4 w-4 mr-2" />
                Transfer Admin Role
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Admin Role</DialogTitle>
                <DialogDescription>
                  Select a member to transfer admin privileges to. You will become a regular member.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={selectedNewAdmin} onValueChange={setSelectedNewAdmin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.imageUrl} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTransferAdminOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleTransferAdmin} disabled={!selectedNewAdmin}>
                  Transfer Admin Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Leave Group */}
          <Dialog open={leaveGroupOpen} onOpenChange={setLeaveGroupOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Leave Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Crown className="h-6 w-6 text-blue-600" />
                  </div>
                  <DialogTitle className="text-xl">Transfer Admin & Leave</DialogTitle>
                </div>
                <DialogDescription className="text-base">
                  Since you&apos;re the admin, you need to transfer admin privileges to another member before leaving.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Select New Admin</h4>
                  <Select value={selectedNewAdmin} onValueChange={setSelectedNewAdmin}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose who will become the new admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.imageUrl} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-3 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                  <strong>Note:</strong> After transferring admin role, you will leave the group and lose access to all group data.
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setLeaveGroupOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleLeaveGroup} 
                  disabled={!selectedNewAdmin}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Transfer & Leave
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Group */}
          <AlertDialog open={deleteGroupOpen} onOpenChange={setDeleteGroupOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full justify-start">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Group
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Group</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this group? This action cannot be undone and will permanently delete:
                </AlertDialogDescription>
                <div className="text-sm text-muted-foreground">
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All group expenses</li>
                    <li>All group settlements</li>
                    <li>All group data</li>
                  </ul>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteGroupOpen(false)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteGroup}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Group
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
    </>
  );
}
