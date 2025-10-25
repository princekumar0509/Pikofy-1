"use client";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, Menu, X, Sparkles } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useStoreUser } from "@/hooks/use-store-user";
import { BarLoader } from "react-spinners";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const { isLoading } = useStoreUser();
  const path = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/70 backdrop-blur-2xl shadow-lg border-b"
            : "bg-transparent"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-pink-500/5 to-cyan-500/5 pointer-events-none" />
        
        <nav className="container mx-auto px-6 h-20 flex items-center justify-between relative">
          {/* Logo with Glow Effect */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <Image
                src={"/logos/logo.png"}
                alt="Equinex Logo"
                width={280}
                height={100}
                className="h-14 w-auto object-contain relative z-10 transition-all duration-300 group-hover:scale-110"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Desktop Navigation - Floating Pills */}
          {path === "/" && (
            <div className="hidden lg:flex items-center gap-2 bg-muted/50 backdrop-blur-xl rounded-full px-2 py-2 border shadow-lg">
              <Link
                href="#features"
                className="px-6 py-2 text-sm font-bold rounded-full hover:bg-background transition-all duration-300 hover:shadow-md relative group"
              >
                <span className="relative z-10">Features</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>
              <Link
                href="#how-it-works"
                className="px-6 py-2 text-sm font-bold rounded-full hover:bg-background transition-all duration-300 hover:shadow-md relative group"
              >
                <span className="relative z-10">How It Works</span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity" />
              </Link>
            </div>
          )}

          {/* Desktop Auth Buttons - Modern Style */}
          <div className="hidden md:flex items-center gap-3">
            <Authenticated>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="lg"
                  className="font-bold rounded-full hover:bg-accent/80 transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </Link>
              <div className="h-8 w-px bg-border" />
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-11 h-11 border-2 border-border hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl ring-2 ring-background",
                    userButtonPopoverCard: "shadow-2xl border backdrop-blur-xl",
                    userPreviewMainIdentifier: "font-bold",
                  },
                }}
                afterSignOutUrl="/"
              />
            </Authenticated>
            <Unauthenticated>
              <SignInButton>
                <Button
                  variant="ghost"
                  size="lg"
                  className="font-bold rounded-full hover:bg-accent/80 transition-all duration-300"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button
                  size="lg"
                  className="gradient font-bold text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get Started
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </SignUpButton>
            </Unauthenticated>
          </div>

          {/* Mobile Menu Button - Circular */}
          <button
            className="md:hidden p-3 hover:bg-accent/80 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 border"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Loading Bar - Gradient Style */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-pink-500 to-cyan-500 animate-pulse" />
        )}
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/95 backdrop-blur-2xl z-40 md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-20 left-0 right-0 bottom-0 z-40 md:hidden overflow-y-auto animate-slide-in-up">
            <div className="container mx-auto px-6 py-12">
              {/* Mobile Navigation Links */}
              {path === "/" && (
                <div className="space-y-4 mb-12">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
                    Navigate
                  </h3>
                  <Link
                    href="#features"
                    className="block text-3xl font-bold hover:text-primary transition-colors py-4 border-b border-border/50 hover:border-primary/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="block text-3xl font-bold hover:text-primary transition-colors py-4 border-b border-border/50 hover:border-primary/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                </div>
              )}

              {/* Mobile Auth Section */}
              <div className="space-y-4 mt-12">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
                  Account
                </h3>
                <Authenticated>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      size="lg"
                      className="w-full justify-center items-center gap-3 font-bold text-lg rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Go to Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center justify-between p-6 bg-accent/30 backdrop-blur-xl rounded-2xl border mt-4">
                    <div>
                      <p className="text-sm font-bold text-muted-foreground">
                        Your Profile
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Manage your account
                      </p>
                    </div>
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-12 h-12 border-2 border-border shadow-lg",
                          userButtonPopoverCard: "shadow-2xl border-2",
                          userPreviewMainIdentifier: "font-bold",
                        },
                      }}
                      afterSignOutUrl="/"
                    />
                  </div>
                </Authenticated>
                <Unauthenticated>
                  <SignInButton>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full font-bold text-lg rounded-2xl border-2"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button
                      size="lg"
                      className="w-full gradient font-bold text-white text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Get Started Free
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </SignUpButton>
                </Unauthenticated>
              </div>

              {/* Decorative Element */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-500/10 via-pink-500/5 to-transparent pointer-events-none" />
            </div>
          </div>
        </>
      )}
    </>
  );
}