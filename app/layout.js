import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import Header from "@/components/header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pikofy",
  description: "The smartest way to split expenses with friends",
  icons: {
    icon: '/logos/logo-s.png?v=2',
    shortcut: '/logos/logo-s.png?v=2',
    apple: '/logos/logo-s.png?v=2',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          appearance={{
            baseTheme: undefined,
            variables: {
              colorPrimary: '#4F46E5', // Deep Indigo/Violet - NEW COLOR
              colorTextOnPrimaryBackground: '#ffffff',
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff',
              colorInputText: '#1f2937',
              borderRadius: '0.75rem',
            },
            elements: {
              formButtonPrimary: 
                'bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200', // NEW GRADIENT
              card: 'shadow-none border-0',
              headerTitle: 'text-2xl font-bold',
              headerSubtitle: 'text-muted-foreground',
              socialButtonsBlockButton: 
                'border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200',
              formFieldLabel: 'font-semibold text-sm',
              formFieldInput: 
                'border-2 focus:border-primary rounded-lg transition-colors',
              footerActionLink: 
                'text-primary hover:text-primary/80 font-semibold',
              identityPreviewText: 'font-medium',
              identityPreviewEditButton: 'text-primary hover:text-primary/80',
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
              <Toaster richColors />

              {children}
            </main>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
