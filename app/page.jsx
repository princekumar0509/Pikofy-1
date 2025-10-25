"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle2, Sparkle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { FEATURES, STEPS, TESTIMONIALS, HERO_STATS } from "@/lib/landing";

export default function LandingPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
              <Sparkle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600 animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-muted-foreground animate-pulse">
            Loading your experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-16 overflow-x-hidden">
      {/* ───── Hero Section ───── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-5 py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 -z-10" />
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-float-medium" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl animate-float-fast" />
        </div>

        <div className="container mx-auto px-4 md:px-6 text-center space-y-12 relative z-10">
          <div className="space-y-8 animate-fade-in">
            <Badge 
              variant="outline" 
              className="bg-white/80 backdrop-blur-sm text-indigo-700 border-2 px-6 py-2 text-sm font-bold rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Sparkle className="h-4 w-4 inline mr-2" />
              Split expenses. Simplify life.
            </Badge>

            <h1 className="mx-auto max-w-6xl text-5xl font-black md:text-7xl lg:text-8xl leading-tight">
              <span className="gradient-title">
                The smartest way to
              </span>
              <br />
              <span className="text-foreground">split expenses</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Track shared expenses, split bills effortlessly, and settle up quickly. 
              <span className="font-semibold text-foreground"> Never worry about who owes who again.</span>
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="gradient font-bold text-white rounded-full px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-white/20"
              >
                <Link href="/sign-up" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg font-bold border-2 bg-white/80 backdrop-blur-sm hover:bg-white transition-all hover:scale-105 shadow-lg"
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 animate-fade-in-delay">
            {HERO_STATS.map(({ value, label, icon: Icon, gradient }) => (
              <div
                key={label}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-3xl font-black text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Hero Image */}
          <div className="max-w-6xl mx-auto pt-8 animate-slide-up">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative gradient p-1 rounded-3xl shadow-2xl">
                <Image
                  src="/hero.png"
                  width={1280}
                  height={720}
                  alt="Pikofy Dashboard Preview"
                  className="rounded-2xl w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Features Section ───── */}
      <section id="features" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <Badge 
            variant="outline" 
            className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-2 px-6 py-2 text-sm font-bold rounded-full"
          >
            Features
          </Badge>
          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black">
            Everything you need to
            <span className="gradient-title block mt-2">split expenses</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Our platform provides all the tools you need to handle shared expenses with ease.
          </p>

          <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ title, Icon, gradient, iconBg, iconColor, accentColor, description, stats }) => (
              <Card
                key={title}
                className={`group relative overflow-hidden border-2 ${accentColor} hover:border-opacity-100 transition-all hover:shadow-2xl hover:-translate-y-2 duration-300 bg-white`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`${iconBg} rounded-2xl p-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-8 w-8 ${iconColor}`} />
                    </div>
                    <Badge variant="secondary" className="font-bold text-xs">
                      {stats}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold text-left">{title}</h3>
                  <p className="text-muted-foreground text-left leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── How It Works Section ───── */}
      <section id="how-it-works" className="py-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge 
            variant="outline" 
            className="bg-white/80 backdrop-blur-sm text-indigo-700 border-2 px-6 py-2 text-sm font-bold rounded-full"
          >
            How It Works
          </Badge>
          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black">
            Splitting expenses has
            <span className="gradient-title block mt-2">never been easier</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Follow these simple steps to start tracking and splitting expenses with friends.
          </p>

          <div className="mx-auto mt-20 grid max-w-6xl gap-12 md:grid-cols-3 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300" />
            
            {STEPS.map(({ number, title, description, icon: Icon, gradient }, index) => (
              <div 
                key={number} 
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center space-y-6 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2">
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full blur-xl opacity-40`} />
                    <div className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-2xl font-black text-white shadow-lg border-4 border-white`}>
                      {number}
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-10`}>
                    <Icon className="h-10 w-10 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Testimonials Section ───── */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Badge 
            variant="outline" 
            className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-2 px-6 py-2 text-sm font-bold rounded-full"
          >
            Testimonials
          </Badge>
          <h2 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black">
            What our users
            <span className="gradient-title block mt-2">are saying</span>
          </h2>

          <div className="mx-auto mt-16 grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, company, image, rating, gradient, verified }) => (
              <Card 
                key={name} 
                className="group relative overflow-hidden border-2 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 bg-white"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
                <CardContent className="p-8 space-y-6">
                  {/* Rating Stars */}
                  <div className="flex gap-1 justify-start">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-left leading-relaxed italic">
                    "{quote}"
                  </p>
                  
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <div className="relative">
                      <Avatar className="h-14 w-14 border-2 shadow-md">
                        <AvatarImage src={image} alt={name} />
                        <AvatarFallback className={`uppercase font-bold bg-gradient-to-br ${gradient} text-white`}>
                          {name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {verified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-bold text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{role}</p>
                      <p className="text-xs text-muted-foreground">{company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA Section ───── */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-medium" />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
              <Sparkle className="h-5 w-5 text-white" />
              <span className="text-white font-bold">Join 50+ happy users</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
            Ready to simplify<br />expense sharing?
          </h2>
          
          <p className="mx-auto max-w-2xl text-xl text-white/90 leading-relaxed">
            Start tracking and splitting expenses in seconds. No credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg font-bold shadow-2xl hover:scale-105 transition-all border-2 border-white/20"
            >
              <Link href="/sign-up" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg" 
              className="bg-transparent text-white border-2 border-white hover:bg-white/10 rounded-full px-8 py-6 text-lg font-bold transition-all hover:scale-105"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t-2 bg-gradient-to-br from-gray-50 to-gray-100 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/logo.png"
                alt="Equinex"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
              <p className="text-sm text-muted-foreground font-medium">
              © {new Date().getFullYear()} Pikofy. All rights reserved.
              </p>
            <div className="flex gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}