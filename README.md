🚀 Pikofy: The Intelligent Expense Splitting Platform<div align="center">The smartest, fastest, and fairest way to split expenses with friends, powered by AI.</div>⭐ Why Pikofy?Tired of messy spreadsheets and awkward "who-owes-who" conversations? Pikofy is a full-stack, real-time application designed to eliminate the stress of shared finances. It combines a serverless, reactive backend with Gemini AI-powered analytics to give you crystal-clear insights and effortless settlement, whether you're managing a group trip or just splitting a dinner bill.✨ Core FeaturesPikofy goes beyond basic splitting to offer a comprehensive financial management experience.💳 Smart Expense ManagementFlexible Splitting: Choose from equal splits, percentages, or exact amounts per person.Intuitive Creation: Easily log expenses with auto-suggest categories based on your description.Rich Categorization: Support for 20+ predefined expense categories to keep your spending organized.👥 Seamless Group CollaborationUnlimited Groups: Create dedicated spaces for roommates, trips, or events.Role-Based Security: Assign Admin and Member roles for controlled group management.Real-Time Transparency: View live activity logs to track every modification and settlement instantly.Bulk Management: Efficiently add or remove members with automated email notifications.📊 AI-Powered Analytics & InsightsVisual Spending Overviews: Interactive Recharts display your group and personal spending patterns.Trend Analysis: Track monthly spending trends to monitor financial health.Gemini AI Insights: Receive AI-powered analysis via email, including personalized saving tips and budget recommendations.⚖️ Intelligent Settlements & Debt ResolutionNet Balance Calculation: A unified ledger aggregates all debts to provide a single, clear net balance across all groups and 1-on-1 debts.Direction-Aware Validation: The platform prevents settling in the wrong direction, ensuring financial accuracy.Automatic Cleanup: Orphan cleanup logic ensures all debts are correctly linked and resolved.🔔 Proactive NotificationsAutomated Reminders: Daily cron jobs (via Inngest) send payment reminder emails for overdue balances.Monthly Financial Summary: Get a detailed spending insights email with AI analysis.Group Activity Alerts: Stay informed with real-time notifications for group changes and new expenses.🛠️ Tech Stack: Built for Performance & ScalabilityPikofy is engineered using a modern, high-performance stack focusing on real-time functionality and developer experience.<div align="center"><table><tr><td align="center" width="96"><img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />Next.js 16</td><td align="center" width="96"><img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />React 19</td><td align="center" width="96"><img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />Tailwind 4</td><td align="center" width="96"><img src="https://skillicons.dev/icons?i=typescript" width="48" height="48" alt="TypeScript" />TypeScript</td></tr><tr><td align="center" width="96"><img src="https://convex.dev/favicon.ico" width="48" height="48" alt="Convex" />Convex</td><td align="center" width="96"><img src="https://clerk.com/favicon.ico" width="48" height="48" alt="Clerk" />Clerk Auth</td><td align="center" width="96"><img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />Inngest</td><td align="center" width="96"><img src="https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg" width="48" height="48" alt="Gemini" />Gemini AI</td></tr></table></div>CategoryTechnologyPurposeFrontendNext.js 16 (App Router), React 19, Tailwind CSS 4Robust, modern web application framework and styling.Backend/DBConvexServerless backend with a real-time, reactive database for instant synchronization.AuthenticationClerkSecure and flexible OAuth/Email & Password user authentication.Background JobsInngestReliable platform for scheduling cron jobs and managing long-running workflows (e.g., daily email reminders).AI IntegrationGoogle GeminiGenerates intelligent spending analysis and personalized tips.Email ServiceNodemailerSMTP handler for notifications and reminders.📸 Project Showcase<div align="center">Shutterstock<p><i>The central dashboard provides a beautiful and intuitive overview of your net balances and spending trends.</i></p><p><i>Flexible expense creation with options for custom splits.</i></p></div>🚀 Getting StartedFollow these steps to set up and run Pikofy locally.PrerequisitesYou will need the following accounts and tools:Node.js 18+ and npm/yarn/pnpmConvex account (convex.dev)Clerk account (clerk.com)Gmail account (for SMTP)Google AI API key (ai.google.dev)Inngest account (inngest.com)InstallationClone the RepositoryBashgit clone https://github.com/yourusername/pikofy.git
cd pikofy
Install DependenciesBashnpm install
Set Up Environment VariablesCreate a file named .env.local and populate it with your keys:Code snippet# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOYMENT=your_deployment

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
CLERK_JWT_ISSUER_DOMAIN=your_clerk_domain

# Email (Gmail SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password

# AI
GEMINI_API_KEY=your_gemini_key

# Inngest
INNGEST_EVENT_KEY=your_inngest_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
Set Up Convex BackendThis command deploys your schema and functions, and watches for changes.Bashnpx convex dev
Run the Development ServerBashnpm run dev
Visit http://localhost:3000 in your browser. 🎉📁 Project Structure OverviewThe codebase is organized by feature and stack component for clear separation of concerns.pikofy/
├── app/                  # Next.js App Router structure
│   ├── (auth)/           # Public/Authentication pages
│   ├── (main)/           # Protected core application routes
│   └── api/              # API routes (used by Inngest webhooks)
├── components/           # Reusable UI components (shadcn/ui, feature-specific)
├── convex/               # All serverless backend logic (queries, mutations, actions)
│   ├── schema.js         # Database schema definition
│   ├── expenses.js       # Core expense/debt logic
│   └── settlements.js    # Settlement processing logic
├── lib/                  # Utility functions and external service integrations
│   └── inngest/          # Inngest background functions and cron jobs
└── hooks/                # Custom React hooks (e.g., use-convex-query)
🤝 ContributingWe welcome contributions to Pikofy! Whether it's reporting a bug, suggesting a feature, or submitting code, your help is appreciated.Fork the project.Create your feature branch (git checkout -b feature/AmazingFeature).Commit your changes (git commit -m 'feat: Add some AmazingFeature').Push to the branch (git push origin feature/AmazingFeature).Open a Pull Request with a detailed description of your changes.📄 LicenseThis project is licensed under the MIT License. See the LICENSE file for details.🙏 AcknowledgmentsA special thank you to the tools and platforms that made this project possible:Next.js - The foundational React framework.Convex - For providing a fast, real-time, and reactive backend experience.Clerk - For painless, secure authentication.Google Gemini - For intelligent, AI-powered financial insights.Inngest - For reliable background jobs and cron scheduling.<div align="center">Built with ❤️ by the Pikofy Team</div>
