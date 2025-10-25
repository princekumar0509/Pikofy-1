"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ParticipantSelector } from "./participant-selector";
import { GroupSelector } from "./group-selector";
import { CategorySelector } from "./category-selector";
import { SplitSelector } from "./split-selector";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { 
  CalendarIcon, 
  DollarSign, 
  FileText, 
  Users, 
  Wallet, 
  Split,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getAllCategories, suggestCategoryFromDescription } from "@/lib/expense-categories";
import { formatCurrency } from "@/lib/currency";

// Form schema validation
const expenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  category: z.string().optional(),
  date: z.date(),
  paidByUserId: z.string().min(1, "Payer is required"),
  splitType: z.enum(["equal", "percentage", "exact"]),
  groupId: z.string().optional(),
});

export function ExpenseForm({ type = "individual", onSuccess }) {
  const [participants, setParticipants] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [splits, setSplits] = useState([]);
  

  // Mutations and queries
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUserPublic);

  const createExpense = useConvexMutation(api.expenses.createExpense);
  const categories = getAllCategories();

  // Set up form with validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      amount: "",
      category: "",
      date: new Date(),
      paidByUserId: currentUser?._id || "",
      splitType: "equal",
      groupId: undefined,
    },
  });

  // Watch for changes
  const amountValue = watch("amount");
  const paidByUserId = watch("paidByUserId");
  const descriptionValue = watch("description");
  const categoryValue = watch("category");

  // When a user is added or removed, update the participant list
  useEffect(() => {
    if (participants.length === 0 && currentUser) {
      // Always add the current user as a participant
      setParticipants([
        {
          id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          imageUrl: currentUser.imageUrl,
        },
      ]);
    }
  }, [currentUser, participants]);

  // Auto-suggest category based on description
  useEffect(() => {
    if (descriptionValue && descriptionValue.length > 3) {
      const suggestedCategory = suggestCategoryFromDescription(descriptionValue);
      if (suggestedCategory) {
        setValue("category", suggestedCategory);
      }
    }
  }, [descriptionValue, setValue]);


  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const amount = parseFloat(data.amount);

      // Prepare splits in the format expected by the API
      const formattedSplits = splits.map((split) => ({
        userId: split.userId,
        amount: split.amount,
        paid: split.userId === data.paidByUserId,
      }));

      // Validate that splits add up to the total (with small tolerance)
      const totalSplitAmount = formattedSplits.reduce(
        (sum, split) => sum + split.amount,
        0
      );
      const tolerance = 0.01;

      if (Math.abs(totalSplitAmount - amount) > tolerance) {
        toast.error(
          `Split amounts don't add up to the total. Please adjust your splits.`
        );
        return;
      }

      // For 1:1 expenses, set groupId to undefined instead of empty string
      const groupId = type === "individual" ? undefined : data.groupId;

      // Create the expense
      await createExpense.mutate({
        description: data.description,
        amount: amount,
        category: data.category || "Other",
        date: data.date.getTime(), // Convert to timestamp
        paidByUserId: data.paidByUserId,
        splitType: data.splitType,
        splits: formattedSplits,
        groupId,
      });

      toast.success("Expense created successfully!");
      reset(); // Reset form

      const otherParticipant = participants.find(
        (p) => p.id !== currentUser._id
      );
      const otherUserId = otherParticipant?.id;

      if (onSuccess) onSuccess(type === "individual" ? otherUserId : groupId);
    } catch (error) {
      toast.error("Failed to create expense: " + error.message);
    }
  };

  if (!currentUser) return null;

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-6">
      <div className="space-y-6">
        {/* Description and amount with icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Description
            </Label>
            <div className="relative">
              <Input
                id="description"
                placeholder="e.g., Dinner at Italian Restaurant"
                {...register("description")}
                className="h-11 text-base pl-4 pr-4 border-2 focus:border-primary transition-colors"
              />
              {errors.description && (
                <div className="absolute right-3 top-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Amount
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ₹
              </div>
              <Input
                id="amount"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0.01"
                {...register("amount")}
                className="h-11 text-base pl-8 pr-4 border-2 focus:border-primary transition-colors font-medium"
              />
              {errors.amount && (
                <div className="absolute right-3 top-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-1">{errors.amount.message}</p>
            )}
          </div>
        </div>


        {/* Category and date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2">
              <Split className="h-4 w-4 text-primary" />
              Category
            </Label>
            <div className="border-2 rounded-lg focus-within:border-primary transition-colors">
              <CategorySelector
                categories={categories || []}
                value={categoryValue}
                onChange={(categoryId) => {
                  if (categoryId) {
                    setValue("category", categoryId);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 justify-start text-left font-normal border-2 hover:border-primary transition-colors",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setValue("date", date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Group selector (for group expenses) */}
        {type === "group" && (
          <div className="space-y-2 p-5 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Select Group
            </Label>
            <GroupSelector
              onChange={(group) => {
                // Only update if the group has changed to prevent loops
                if (!selectedGroup || selectedGroup.id !== group.id) {
                  setSelectedGroup(group);
                  setValue("groupId", group.id);

                  // Update participants with the group members
                  if (group.members && Array.isArray(group.members)) {
                    // Set the participants once, don't re-set if they're the same
                    setParticipants(group.members);
                  }
                }
              }}
            />
            {!selectedGroup && (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                <AlertCircle className="h-3 w-3" />
                Please select a group to continue
              </p>
            )}
          </div>
        )}

        {/* Participants (for individual expenses) */}
        {type === "individual" && (
          <div className="space-y-2 p-5 bg-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/20">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Participants
            </Label>
            <ParticipantSelector
              participants={participants}
              onParticipantsChange={setParticipants}
            />
            {participants.length <= 1 && (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-2">
                <AlertCircle className="h-3 w-3" />
                Please add at least one other participant
              </p>
            )}
          </div>
        )}

        {/* Paid by selector */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            Paid by
          </Label>
          <select
            className="w-full h-11 rounded-lg border-2 border-input bg-background px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            {...register("paidByUserId")}
          >
            <option value="">Select who paid</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.id === currentUser._id ? "You" : participant.name}
              </option>
            ))}
          </select>
          {errors.paidByUserId && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.paidByUserId.message}
            </p>
          )}
        </div>

        {/* Split type */}
        <div className="space-y-3 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Split className="h-4 w-4 text-primary" />
            Split Type
          </Label>
          <Tabs
            defaultValue="equal"
            onValueChange={(value) => setValue("splitType", value)}
          >
            <TabsList className="grid w-full grid-cols-3 h-11 p-1 bg-background/50">
              <TabsTrigger value="equal" className="text-sm font-medium">
                Equal
              </TabsTrigger>
              <TabsTrigger value="percentage" className="text-sm font-medium">
                Percentage
              </TabsTrigger>
              <TabsTrigger value="exact" className="text-sm font-medium">
                Exact Amounts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="equal" className="pt-4 mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/60 p-3 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p>Split equally among all participants</p>
              </div>
              <SplitSelector
                type="equal"
                amount={parseFloat(amountValue) || 0}
                participants={participants}
                paidByUserId={paidByUserId}
                onSplitsChange={setSplits}
              />
            </TabsContent>
            <TabsContent value="percentage" className="pt-4 mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/60 p-3 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p>Split by custom percentages</p>
              </div>
              <SplitSelector
                type="percentage"
                amount={parseFloat(amountValue) || 0}
                participants={participants}
                paidByUserId={paidByUserId}
                onSplitsChange={setSplits}
              />
            </TabsContent>
            <TabsContent value="exact" className="pt-4 mt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background/60 p-3 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p>Enter exact amounts for each participant</p>
              </div>
              <SplitSelector
                type="exact"
                amount={parseFloat(amountValue) || 0}
                participants={participants}
                paidByUserId={paidByUserId}
                onSplitsChange={setSplits}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t-2">
        <Button
          type="submit"
          disabled={isSubmitting || participants.length <= 1}
          className="h-12 px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Creating...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Create Expense
            </>
          )}
        </Button>
      </div>
    </form>

    </>
  );
}