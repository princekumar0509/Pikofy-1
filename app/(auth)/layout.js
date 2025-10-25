import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import Header from "@/components/header";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Equinex - Smart Expense Splitting",
  description: "The smartest way to split expenses with friends. Track shared expenses, split bills effortlessly, and settle up quickly.",
  keywords: ["expense splitting", "bill splitting", "shared expenses", "group expenses", "expense tracker"],
  authors: [{ name: "Equinex" }],
  creator: "Equinex",
  openGraph: {
    title: "Equinex - Smart Expense Splitting",
    description: "The smartest way to split expenses with friends",
    type: "website",
    locale: "en_US",
    siteName: "Equinex",
  },
  twitter: {
    card: "summary_large_image",
    title: "Equinex - Smart Expense Splitting",
    description: "The smartest way to split expenses with friends",
  },
  icons: {
    icon: [
      { url: '/logos/logo-s.png?v=2', sizes: 'any' },
      { url: '/logos/logo-s.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/logos/logo-s.png?v=2', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/logos/logo-s.png?v=2',
    apple: '/logos/logo-s.png?v=2',
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#6366f1', // Indigo-500
              colorSuccess: '#10b981', // Emerald-500
              colorWarning: '#f59e0b', // Amber-500
              colorDanger: '#ef4444', // Red-500
              colorTextOnPrimaryBackground: '#ffffff',
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff',
              colorInputText: '#1f2937',
              colorText: '#0f172a',
              colorTextSecondary: '#64748b',
              fontFamily: inter.style.fontFamily,
              fontFamilyButtons: inter.style.fontFamily,
              fontSize: '0.9375rem',
              fontWeight: {
                normal: 500,
                medium: 600,
                bold: 700,
              },
              borderRadius: '1rem', // Larger, more modern radius
              spacingUnit: '1rem',
            },
            elements: {
              // Root Card Styling
              rootBox: 'w-full',
              card: 'shadow-none border-0 bg-transparent',
              
              // Header Styling
              headerTitle: 'text-3xl font-black text-foreground mb-2',
              headerSubtitle: 'text-base text-muted-foreground font-medium',
              
              // Primary Button - Premium Gradient
              formButtonPrimary: 
                'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-2xl py-3',
              
              // Secondary Buttons
              formButtonReset: 
                'border-2 border-border hover:border-primary hover:bg-accent transition-all duration-200 font-semibold rounded-xl',
              
              // Social Buttons
              socialButtonsBlockButton: 
                'border-2 border-border hover:border-primary hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950 dark:hover:to-purple-950 transition-all duration-300 font-semibold rounded-xl shadow-sm hover:shadow-md transform hover:scale-[1.02]',
              socialButtonsBlockButtonText: 'font-semibold text-foreground',
              socialButtonsIconButton: 'rounded-xl',
              
              // Divider
              dividerLine: 'bg-gradient-to-r from-transparent via-border to-transparent',
              dividerText: 'text-muted-foreground font-medium text-sm',
              
              // Form Fields
              formFieldLabel: 'font-bold text-sm text-foreground mb-2',
              formFieldInput: 
                'border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-200 font-medium bg-background hover:border-primary/50',
              formFieldInputShowPasswordButton: 'text-muted-foreground hover:text-foreground',
              
              // Form Field States
              formFieldSuccessText: 'text-emerald-600 font-medium text-sm',
              formFieldErrorText: 'text-red-600 font-medium text-sm',
              formFieldWarningText: 'text-amber-600 font-medium text-sm',
              formFieldHintText: 'text-muted-foreground text-sm',
              
              // Footer Links
              footerActionLink: 
                'text-primary hover:text-primary/80 font-bold underline-offset-4 hover:underline transition-all',
              footerActionText: 'text-muted-foreground font-medium',
              footerActionButton: 'font-bold text-primary hover:text-primary/80',
              
              // Identity Preview (Profile)
              identityPreview: 'rounded-xl border-2 border-border bg-accent/50 p-4',
              identityPreviewText: 'font-semibold text-foreground',
              identityPreviewEditButton: 
                'text-primary hover:text-primary/80 font-bold underline-offset-4 hover:underline',
              
              // Avatar
              avatarBox: 'rounded-xl border-2 border-border shadow-md',
              avatarImage: 'rounded-xl',
              
              // Alert/Error Messages
              alert: 'rounded-xl border-2 p-4',
              alertText: 'font-medium text-sm',
              
              // OTP Input
              formFieldInputGroup: 'gap-2',
              
              // Badges
              badge: 'rounded-lg font-bold text-xs px-3 py-1',
              
              // Modal/Overlay
              modalCloseButton: 'hover:bg-accent rounded-lg transition-colors',
              
              // Navbar (User Button)
              navbar: 'rounded-xl border-2 shadow-lg backdrop-blur-xl',
              navbarButton: 'hover:bg-accent transition-colors rounded-lg',
              
              // User Button Dropdown
              userButtonPopoverCard: 'rounded-2xl border-2 shadow-2xl backdrop-blur-xl',
              userButtonPopoverActionButton: 
                'hover:bg-accent transition-colors rounded-lg font-medium',
              userButtonPopoverActionButtonText: 'font-medium',
              userButtonPopoverFooter: 'border-t-2',
              
              // Organization Switcher
              organizationSwitcherTrigger: 
                'rounded-xl border-2 hover:border-primary transition-all hover:shadow-md',
              organizationSwitcherTriggerIcon: 'text-muted-foreground',
              
              // Tabs
              tabButton: 'font-semibold transition-all rounded-lg hover:bg-accent',
              tabPanel: 'rounded-xl',
            },
            layout: {
              socialButtonsVariant: 'blockButton',
              socialButtonsPlacement: 'top',
              showOptionalFields: true,
            },
          }}
          signUpForceRedirectUrl="/dashboard"
          signInForceRedirectUrl="/dashboard"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        >
          <ConvexClientProvider>
            <Header />
            <main className="min-h-screen">
              <Toaster 
                richColors 
                position="top-right"
                expand={false}
                duration={4000}
                closeButton
                toastOptions={{
                  className: 'rounded-2xl border-2 shadow-xl backdrop-blur-xl font-semibold',
                  style: {
                    padding: '1rem 1.5rem',
                  },
                }}
              />
              {children}
            </main>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}