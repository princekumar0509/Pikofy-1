"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExpenseForm } from "./components/expense-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users, Plus, Sparkles } from "lucide-react";

export default function NewExpensePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("individual");

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 shadow-lg border-2 border-foreground hard-shadow">
            <Plus className="h-7 w-7 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl gradient-title mb-3">
          Add New Expense
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Split bills with friends, family, or groups. Track who paid and who owes what.
        </p>
      </div>

      <Card className="border-2 border-foreground hard-shadow">
        <CardContent className="p-6 md:p-8">
          <Tabs className="pb-2" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-muted/50 mb-4 rounded-xl border border-border">
              <TabsTrigger 
                value="individual" 
                className="text-base font-semibold flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.01] transition-all duration-300"
              >
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Individual</span>
                <span className="sm:hidden">1:1</span>
              </TabsTrigger>
              <TabsTrigger 
                value="group" 
                className="text-base font-semibold flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.01] transition-all duration-300"
              >
                <Users className="h-5 w-5" />
                Group
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual" className="mt-0">
              {/* Visual indicator - using indigo/purple tones */}
              <div className="mb-6 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-l-4 border-indigo-600 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-indigo-900 dark:text-indigo-100">Individual Expense</span>
                  <span className="text-indigo-700 dark:text-indigo-300">- Split with one person</span>
                </div>
              </div>
              
              {activeTab === "individual" && (
                <ExpenseForm
                  type="individual"
                  onSuccess={(id) => router.push(`/person/${id}`)}
                />
              )}
            </TabsContent>
            
            <TabsContent value="group" className="mt-0">
              {/* Visual indicator - using pink/rose tones */}
              <div className="mb-6 p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border-l-4 border-pink-600 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="font-semibold text-pink-900 dark:text-pink-100">Group Expense</span>
                  <span className="text-pink-700 dark:text-pink-300">- Split with multiple people</span>
                </div>
              </div>
              
              {activeTab === "group" && (
                <ExpenseForm
                  type="group"
                  onSuccess={(id) => router.push(`/groups/${id}`)}
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Helpful tips section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-pink-50 dark:from-indigo-950/20 dark:to-pink-950/20 rounded-xl border-2 border-indigo-200/50 dark:border-indigo-800/50 hard-shadow">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
              Quick Tips
            </h3>
            <ul className="space-y-1.5 text-sm text-indigo-800 dark:text-indigo-200">
              <li>• <strong>Individual expenses</strong> are perfect for splitting bills with one person</li>
              <li>• <strong>Group expenses</strong> let you split costs among multiple people at once</li>
              <li>• Choose between equal splits, percentage-based, or exact amounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}