"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

// Simple AlertDialog implementation without Radix UI
const AlertDialogContext = React.createContext({
  open: false,
  setOpen: () => {},
})

const AlertDialog = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  const contextValue = React.useMemo(() => ({
    open: isOpen,
    setOpen: (value) => {
      setIsOpen(value)
      onOpenChange?.(value)
    }
  }), [isOpen, onOpenChange])

  return (
    <AlertDialogContext.Provider value={contextValue}>
      {children}
    </AlertDialogContext.Provider>
  )
}

const AlertDialogTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext)
  
  if (asChild) {
    const handleClick = (e) => {
      setOpen(true)
      children.props.onClick?.(e)
    }
    
    return React.cloneElement(children, {
      ...props,
      onClick: handleClick
    })
  }
  
  return (
    <button
      ref={ref}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  )
})
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(AlertDialogContext)
  
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80"
        onClick={() => setOpen(false)}
      />
      
      {/* Content */}
      <div
        ref={ref}
        className={cn(
          "relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
))
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
))
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef(({ className, onClick, ...props }, ref) => {
  const { setOpen } = React.useContext(AlertDialogContext)
  
  const handleClick = (e) => {
    setOpen(false)
    onClick?.(e)
  }
  
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        buttonVariants({ variant: "outline" }),
        "mt-2 sm:mt-0",
        className
      )}
      onClick={handleClick}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

// Dummy components for compatibility
const AlertDialogPortal = ({ children }) => children
const AlertDialogOverlay = () => null

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
