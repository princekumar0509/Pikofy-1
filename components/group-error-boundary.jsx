"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

export function GroupErrorBoundary({ groupId, children }) {
  const router = useRouter();
  
  const { data, isLoading, error } = useConvexQuery(
    api.groups.getGroupExpenses, 
    { groupId },
    { 
      retry: false, // Don't retry on error
      refetchOnWindowFocus: false // Don't refetch on window focus
    }
  );

  useEffect(() => {
    if (error) {
      // Check if it's a permission error
      if (error.message?.includes("not a member") || error.message?.includes("Group not found")) {
        toast.error("You no longer have access to this group. Redirecting...");
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/dashboard?message=group_removed");
        }, 2000);
      }
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  if (error) {
    // Show error page
    if (error.message?.includes("not a member")) {
      return (
        <div className="container mx-auto py-12 text-center">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  You are no longer a member of this group. You may have been removed or the group was deleted.
                </p>
                <Button onClick={() => router.push("/dashboard?message=group_removed")} className="w-full">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    if (error.message?.includes("Group not found")) {
      return (
        <div className="container mx-auto py-12 text-center">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600">Group Not Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  This group may have been deleted or doesn&apos;t exist.
                </p>
                <Button onClick={() => router.push("/dashboard?message=group_removed")} className="w-full">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Generic error
    return (
      <div className="container mx-auto py-12 text-center">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Something went wrong. Please try again.
              </p>
              <Button onClick={() => router.push("/groups")} className="w-full">
                Back to Groups
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If no error, render the children
  return children;
}
