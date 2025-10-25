"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)} // Increased gap for spacing
      {...props} />
  );
}

function TabsList({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-secondary text-muted-foreground inline-flex h-12 w-full items-center justify-center rounded-xl p-1 shadow-inner border border-border", // Increased size and added border/shadow for depth
        className
      )}
      {...props} />
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:scale-[1.01] hover:bg-secondary/80 focus-visible:ring-primary/50 focus-visible:outline-none dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground text-foreground flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-transparent px-4 py-2 text-base font-semibold whitespace-nowrap transition-all duration-300 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5", // Major style change: Full color fill, bolder font, larger size
        className
      )}
      {...props} />
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none mt-2", className)}
      {...props} />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
