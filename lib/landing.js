import { 
  Bell, 
  CreditCard, 
  PieChart, 
  Receipt, 
  Users, 
  Zap,
  Sparkles,
  Target,
  CheckCircle2
} from "lucide-react";

export const FEATURES = [
  {
    title: "Collaborative Groups",
    Icon: Users,
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600",
    accentColor: "border-violet-500/20",
    description:
      "Build expense groups for any occasion—roommates, vacations, celebrations, and beyond.",
    stats: "∞ Groups",
  },
  {
    title: "Intelligent Settlements",
    Icon: Zap,
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
    accentColor: "border-amber-500/20",
    description:
      "Advanced algorithms optimize payment flows, reducing settlement transactions by up to 80%.",
    stats: "Smart AI",
  },
  {
    title: "Visual Analytics",
    Icon: PieChart,
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
    accentColor: "border-emerald-500/20",
    description:
      "Beautiful charts reveal spending trends, category breakdowns, and personalized insights.",
    stats: "Real-time",
  },
  {
    title: "Smart Notifications",
    Icon: Bell,
    gradient: "from-pink-500 to-rose-600",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-600",
    accentColor: "border-pink-500/20",
    description:
      "Stay informed with intelligent reminders and spending alerts tailored to your habits.",
    stats: "Instant",
  },
  {
    title: "Flexible Splitting",
    Icon: Receipt,
    gradient: "from-cyan-500 to-blue-600",
    iconBg: "bg-cyan-500/10",
    iconColor: "text-cyan-600",
    accentColor: "border-cyan-500/20",
    description:
      "Equal splits, custom percentages, exact amounts, or even itemized bills—we've got you covered.",
    stats: "4+ Methods",
  },
  {
    title: "Live Sync",
    Icon: Sparkles,
    gradient: "from-indigo-500 to-purple-600",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-600",
    accentColor: "border-indigo-500/20",
    description:
      "Lightning-fast synchronization ensures everyone sees updates instantly, anywhere.",
    stats: "<100ms",
  },
];

export const STEPS = [
  {
    number: "01",
    title: "Launch Your Group",
    description:
      "Create a dedicated space for your crew—whether it's roommates, travel buddies, or event partners.",
    icon: Target,
    gradient: "from-violet-600 via-purple-600 to-pink-600",
    delay: "0ms",
  },
  {
    number: "02",
    title: "Log Expenses",
    description:
      "Capture every transaction with details on who paid and how costs should be divided among the group.",
    icon: Receipt,
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",
    delay: "100ms",
  },
  {
    number: "03",
    title: "Balance & Settle",
    description:
      "Get a clear picture of who owes what, then mark payments complete as balances are cleared.",
    icon: CheckCircle2,
    gradient: "from-emerald-600 via-teal-600 to-cyan-600",
    delay: "200ms",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Pikofy has made tracking group expenses so simple! No more confusion about who paid for what. Highly recommended!",
    name: "Abhishek",
    image: "/testimonials/image1.png",
    role: "Founder & CEO",
    company: "TechVentures",
    rating: 5,
    gradient: "from-violet-500 to-purple-600",
    verified: true,
  },
  {
    quote:
      "Planning events means managing multiple vendors and group expenses. Pikofy makes tracking and splitting costs incredibly simple!",
    name: "Pallavi",
    image: "/testimonials/image2.png",
    role: "Lead Event Strategist",
    company: "Celebrations Co.",
    rating: 5,
    gradient: "from-pink-500 to-rose-600",
    verified: true,
  },
  {
    quote:
      "Managing expenses with roommates used to be a headache. Pikofy made it effortless and transparent for everyone!",
    name: "Rahul",
    image: "/testimonials/image3.png",
    role: "Senior Software Engineer",
    company: "Google",
    rating: 5,
    gradient: "from-cyan-500 to-blue-600",
    verified: true,
  },
];

// Bonus: Stats for hero section
export const HERO_STATS = [
  {
    value: "50K+",
    label: "Active Users",
    icon: Users,
    gradient: "from-violet-600 to-purple-600",
  },
  {
    value: "$2M+",
    label: "Expenses Tracked",
    icon: CreditCard,
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    value: "99.9%",
    label: "Uptime",
    icon: Zap,
    gradient: "from-amber-600 to-orange-600",
  },
  {
    value: "4.9★",
    label: "User Rating",
    icon: Sparkles,
    gradient: "from-pink-600 to-rose-600",
  },
];
