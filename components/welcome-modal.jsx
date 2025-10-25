"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { 
  Sparkles, 
  Receipt, 
  Users, 
  BarChart3, 
  CheckCircle2,
  ArrowRight,
  X
} from "lucide-react";

export function WelcomeModal({ open, onClose }) {
  const router = useRouter();

  const handleGetStarted = () => {
    onClose();
    router.push("/expenses/new");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden border-0">
        <VisuallyHidden>
          <DialogTitle>Welcome to Equinex</DialogTitle>
        </VisuallyHidden>
        {/* Header with gradient background */}
        <div className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 px-6 pt-8 pb-12 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome to Equinex!</h2>
              <p className="text-blue-100 text-lg">
                Start splitting expenses the smart way
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Features Grid */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Here&apos;s what you can do:</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20">
                <div className="p-2 rounded-lg bg-blue-600 text-white mt-0.5">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base mb-1">Track Expenses</h4>
                  <p className="text-sm text-muted-foreground">
                    Add and categorize expenses in seconds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/50 dark:bg-cyan-950/20">
                <div className="p-2 rounded-lg bg-cyan-600 text-white mt-0.5">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base mb-1">Split with Friends</h4>
                  <p className="text-sm text-muted-foreground">
                    Create groups or split expenses one-on-one
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-950/20">
                <div className="p-2 rounded-lg bg-indigo-600 text-white mt-0.5">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-base mb-1">Settle Up Smart</h4>
                  <p className="text-sm text-muted-foreground">
                    Track balances and settle debts easily
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleGetStarted}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
            >
              <Receipt className="mr-2 h-5 w-5" />
              Add Your First Expense
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-11"
            >
              Explore Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

