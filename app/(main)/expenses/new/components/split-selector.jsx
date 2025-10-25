"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/currency";

export function SplitSelector({
  type,
  amount,
  participants,
  paidByUserId,
  onSplitsChange,
}) {
  const { user } = useUser();
  
  // Calculate initial splits based on type
  const initialSplits = useMemo(() => {
    if (!amount || amount <= 0 || participants.length === 0) {
      return [];
    }

    let newSplits = [];

    if (type === "equal") {
      // Equal splits
      const shareAmount = amount / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        email: participant.email,
        imageUrl: participant.imageUrl,
        amount: shareAmount,
        percentage: 100 / participants.length,
        paid: participant.id === paidByUserId,
      }));
    } else if (type === "percentage") {
      // Initialize percentage splits evenly
      const evenPercentage = 100 / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        email: participant.email,
        imageUrl: participant.imageUrl,
        amount: (amount * evenPercentage) / 100,
        percentage: evenPercentage,
        paid: participant.id === paidByUserId,
      }));
    } else if (type === "exact") {
      // Initialize exact splits evenly
      const evenAmount = amount / participants.length;
      newSplits = participants.map((participant) => ({
        userId: participant.id,
        name: participant.name,
        email: participant.email,
        imageUrl: participant.imageUrl,
        amount: evenAmount,
        percentage: (evenAmount / amount) * 100,
        paid: participant.id === paidByUserId,
      }));
    }

    return newSplits;
  }, [type, amount, participants, paidByUserId]);

  const [splits, setSplits] = useState(initialSplits);

  // Sync splits with initial calculation when dependencies change
  useEffect(() => {
    setSplits(initialSplits);
  }, [initialSplits]);

  // Calculate totals from current splits
  const totalAmount = useMemo(() => {
    return splits.reduce((sum, split) => sum + split.amount, 0);
  }, [splits]);

  const totalPercentage = useMemo(() => {
    return splits.reduce((sum, split) => sum + split.percentage, 0);
  }, [splits]);

  // Notify parent when splits change
  useEffect(() => {
    if (splits.length > 0 && onSplitsChange) {
      onSplitsChange(splits);
    }
  }, [splits, onSplitsChange]);

  // Update the percentage splits - no automatic adjustment of other values
  const updatePercentageSplit = (userId, newPercentage) => {
    // Update just this user's percentage and recalculate amount
    const updatedSplits = splits.map((split) => {
      if (split.userId === userId) {
        return {
          ...split,
          percentage: newPercentage,
          amount: (amount * newPercentage) / 100,
        };
      }
      return split;
    });

    setSplits(updatedSplits);
  };

  // Update the exact amount splits - no automatic adjustment of other values
  const updateExactSplit = (userId, newAmount) => {
    const parsedAmount = parseFloat(newAmount) || 0;

    // Update just this user's amount and recalculate percentage
    const updatedSplits = splits.map((split) => {
      if (split.userId === userId) {
        return {
          ...split,
          amount: parsedAmount,
          percentage: amount > 0 ? (parsedAmount / amount) * 100 : 0,
        };
      }
      return split;
    });

    setSplits(updatedSplits);
  };

  // Check if totals are valid
  const isPercentageValid = Math.abs(totalPercentage - 100) < 0.01;
  const isAmountValid = Math.abs(totalAmount - amount) < 0.01;

  return (
    <div className="space-y-3 mt-2">
      {splits.map((split) => (
        <div
          key={split.userId}
          className="flex items-center justify-between gap-4 p-3 rounded-lg bg-background/80 border border-muted hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-[140px]">
            <Avatar className="h-8 w-8 border-2 border-muted">
              <AvatarImage src={split.imageUrl} />
              <AvatarFallback className="text-xs font-medium">
                {split.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {split.userId === user?.id ? "You" : split.name}
            </span>
          </div>

          {type === "equal" && (
            <div className="text-right text-sm font-semibold">
              <span className="text-lg text-primary">{formatCurrency(split.amount)}</span>
              <span className="text-muted-foreground ml-2">({split.percentage.toFixed(1)}%)</span>
            </div>
          )}

          {type === "percentage" && (
            <div className="flex items-center gap-4 flex-1">
              <Slider
                value={[split.percentage]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) =>
                  updatePercentageSplit(split.userId, values[0])
                }
                className="flex-1"
              />
              <div className="flex gap-2 items-center min-w-[140px]">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={split.percentage.toFixed(1)}
                  onChange={(e) =>
                    updatePercentageSplit(
                      split.userId,
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-16 h-9 text-center font-semibold"
                />
                <span className="text-sm text-muted-foreground font-medium">%</span>
                <span className="text-sm font-semibold text-primary">{formatCurrency(split.amount)}</span>
              </div>
            </div>
          )}

          {type === "exact" && (
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1"></div>
              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground font-medium">₹</span>
                <Input
                  type="number"
                  min="0"
                  max={amount * 2}
                  step="0.01"
                  value={split.amount.toFixed(2)}
                  onChange={(e) =>
                    updateExactSplit(split.userId, e.target.value)
                  }
                  className="w-28 h-9 font-semibold"
                />
                <span className="text-xs text-muted-foreground ml-1 min-w-[50px]">
                  ({split.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Total row */}
      <div className="flex justify-between items-center border-t-2 border-muted pt-4 mt-4 p-4 rounded-lg bg-muted/30">
        <span className="font-semibold text-base">Total</span>
        <div className="text-right">
          <span
            className={`font-bold text-lg ${!isAmountValid ? "text-amber-600" : "text-primary"}`}
          >
            {formatCurrency(totalAmount)}
          </span>
          {type !== "equal" && (
            <span
              className={`text-sm ml-2 font-medium ${!isPercentageValid ? "text-amber-600" : "text-muted-foreground"}`}
            >
              ({totalPercentage.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>

      {/* Validation warnings */}
      {type === "percentage" && !isPercentageValid && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>The percentages should add up to 100%.</span>
        </div>
      )}

      {type === "exact" && !isAmountValid && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
          <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>The sum of all splits ({formatCurrency(totalAmount)}) should equal the total amount ({formatCurrency(amount)}).</span>
        </div>
      )}
    </div>
  );
}