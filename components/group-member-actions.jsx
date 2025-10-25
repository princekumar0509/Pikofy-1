"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function GroupMemberActions({ groupId }) {
  const router = useRouter();
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUserPublic);
  
  // Mutations
  const leaveGroup = useConvexMutation(api.groups.leaveGroup);
  const [isLeaving, setIsLeaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLeaveGroup = async () => {
    setIsLeaving(true);
    try {
      await leaveGroup.mutate({ groupId });
      toast.success("Successfully left the group! Redirecting to dashboard...");
      setShowModal(false);
      // Redirect to dashboard with a small delay to show the success message
      setTimeout(() => {
        router.push("/dashboard?message=left_group");
      }, 1500);
    } catch (error) {
      toast.error("Failed to leave group: " + error.message);
      setIsLeaving(false);
      setShowModal(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
            <LogOut className="h-5 w-5" />
            Member Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full justify-start border-orange-300 hover:bg-orange-100 hover:border-orange-400"
            onClick={() => setShowModal(true)}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Leave Group
          </Button>
        </CardContent>
      </Card>

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold">Leave Group</h2>
              </div>

              <p className="text-gray-600 mb-4">
                Are you sure you want to leave this group? This action will:
              </p>
              
              {/* Consequences */}
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <ul className="space-y-2 text-sm text-orange-800">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Remove you from all group expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Delete your settlements with other members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>Transfer any expenses you paid to other members</span>
                  </li>
                </ul>
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <strong>Warning:</strong> This action cannot be undone.
                </div>
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleLeaveGroup}
                  disabled={isLeaving}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLeaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Leaving...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Leave Group
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
