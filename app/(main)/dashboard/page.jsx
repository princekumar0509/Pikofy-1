"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ExpenseSummary } from "./components/expense-summary";
import { BalanceSummary } from "./components/balance-summary.jsx";
import { GroupList } from "./components/group-list";
import { WelcomeModal } from "@/components/welcome-modal";
import { formatCurrency } from "@/lib/currency";

export default function Dashboard() {
  const searchParams = useSearchParams();
  // Check if user should see welcome modal
  const { data: shouldShowWelcome } = useConvexQuery(api.users.shouldShowWelcome);
  const { mutate: markWelcomeSeen } = useConvexMutation(api.users.markWelcomeSeen);

  // Derive showWelcome directly from query data (no useState/useEffect needed)
  const showWelcome = shouldShowWelcome === true;

  const handleCloseWelcome = async () => {
    try {
      await markWelcomeSeen();
    } catch (error) {
      console.error("Failed to mark welcome as seen:", error);
    }
  };
  
  // Show success message based on URL parameter
  useEffect(() => {
    const message = searchParams.get("message");
    
    if (message === "group_deleted") {
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <div>
            <p className="font-semibold">Group Deleted Successfully</p>
            <p className="text-sm text-muted-foreground">The group has been permanently deleted</p>
          </div>
        </div>,
        { duration: 5000 }
      );
    } else if (message === "left_group") {
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <div>
            <p className="font-semibold">Left Group Successfully</p>
            <p className="text-sm text-muted-foreground">You are no longer a member of that group</p>
          </div>
        </div>,
        { duration: 5000 }
      );
    } else if (message === "group_removed") {
      toast.info(
        <div className="flex items-center gap-2">
          <div>
            <p className="font-semibold">Group No Longer Accessible</p>
            <p className="text-sm text-muted-foreground">The group may have been deleted or you were removed</p>
          </div>
        </div>,
        { duration: 5000 }
      );
    }
  }, [searchParams]);

  const { data: balances, isLoading: balancesLoading } = useConvexQuery(
    api.dashboard.getUserBalances
  );

  const { data: groups, isLoading: groupsLoading } = useConvexQuery(
    api.dashboard.getUserGroups
  );

  const { data: totalSpent, isLoading: totalSpentLoading } = useConvexQuery(
    api.dashboard.getTotalSpent
  );

  const { data: monthlySpending, isLoading: monthlySpendingLoading } =
    useConvexQuery(api.dashboard.getMonthlySpending);

  const isLoading =
    balancesLoading ||
    groupsLoading ||
    totalSpentLoading ||
    monthlySpendingLoading;

  return (
    <>
      {/* Welcome Modal for First-Time Users */}
      <WelcomeModal open={showWelcome} onClose={handleCloseWelcome} />

      <div className="container mx-auto py-6 space-y-6">
        {isLoading ? (
          <div className="w-full py-12 flex justify-center">
            <BarLoader width={"100%"} color="#36d7b7" />
          </div>
        ) : (
          <>
            <div className="flex  justify-between flex-col sm:flex-row sm:items-center gap-4">
              <h1 className="text-5xl gradient-title">Dashboard</h1>
              <Button asChild>
                <Link href="/expenses/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add expense
                </Link>
              </Button>
            </div>

          {/* Balance overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {balances?.totalBalance > 0 ? (
                    <span className="text-green-600">
                      +{formatCurrency(balances?.totalBalance)}
                    </span>
                  ) : balances?.totalBalance < 0 ? (
                    <span className="text-red-600">
                      -{formatCurrency(Math.abs(balances?.totalBalance))}
                    </span>
                  ) : (
                    <span>{formatCurrency(0)}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {balances?.totalBalance > 0
                    ? "You are owed money"
                    : balances?.totalBalance < 0
                      ? "You owe money"
                      : "All settled up!"}
                </p>
                <p className="text-xs text-blue-600 mt-2 bg-blue-50 dark:bg-blue-950/20 p-2 rounded-md">
                  💡 Total = What you&apos;re owed - What you owe
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  You are owed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(balances?.youAreOwed || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {balances?.oweDetails?.youAreOwedBy?.length || 0} people
                </p>
                <p className="text-xs text-green-600 mt-2 bg-green-50 dark:bg-green-950/20 p-2 rounded-md">
                  ✓ Money others need to pay you
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  You owe
                </CardTitle>
              </CardHeader>
              <CardContent>
                {balances?.youOwe > 0 ? (
                  <>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(balances?.youOwe || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      To {balances?.oweDetails?.youOwe?.length || 0} people
                    </p>
                    <p className="text-xs text-red-600 mt-2 bg-red-50 dark:bg-red-950/20 p-2 rounded-md">
                      ⚠ Money you need to pay others
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{formatCurrency(0)}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      You don&apos;t owe anyone
                    </p>
                    <p className="text-xs text-gray-600 mt-2 bg-gray-50 dark:bg-gray-900/20 p-2 rounded-md">
                      ✓ No pending payments
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Expense summary */}
              <ExpenseSummary
                monthlySpending={monthlySpending}
                totalSpent={totalSpent}
              />
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Balance details */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Balance Details</CardTitle>
                    <Button variant="link" asChild className="p-0">
                      <Link href="/contacts">
                        View all
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <BalanceSummary balances={balances} />
                </CardContent>
              </Card>

              {/* Groups */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Your Groups</CardTitle>
                    <Button variant="link" asChild className="p-0">
                      <Link href="/contacts">
                        View all
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <GroupList groups={groups} />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/contacts?createGroup=true">
                      <Users className="mr-2 h-4 w-4" />
                      Create new group
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </>
      )}
      </div>
    </>
  );
}