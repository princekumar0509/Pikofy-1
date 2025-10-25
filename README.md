# 🚀 Pikofy: The Intelligent Expense Splitting Platform

\<div align="center"\>

**The smartest, fastest, and fairest way to split expenses with friends, powered by AI.**

[](YOUR_DEMO_LINK)
[](#--features)
[](#--tech-stack)
[](#--getting-started)

\</div\>

-----

## ⭐ Why Pikofy?

Tired of messy spreadsheets and awkward "who-owes-who" conversations? **Pikofy** is a full-stack, real-time application designed to eliminate the stress of shared finances. It combines a **serverless, reactive backend** with **Gemini AI-powered analytics** to give you crystal-clear insights and effortless settlement, whether you're managing a group trip or just splitting a dinner bill.

-----

## ✨ Core Features

Pikofy goes beyond basic splitting to offer a comprehensive financial management experience.

### 💳 **Smart Expense Management**

  * **Flexible Splitting:** Choose from **equal splits, percentages, or exact amounts** per person.
  * **Intuitive Creation:** Easily log expenses with **auto-suggest categories** based on your description.
  * **Rich Categorization:** Support for **20+ predefined expense categories** to keep your spending organized.

### 👥 **Seamless Group Collaboration**

  * **Unlimited Groups:** Create dedicated spaces for roommates, trips, or events.
  * **Role-Based Security:** Assign **Admin and Member** roles for controlled group management.
  * **Real-Time Transparency:** View **live activity logs** to track every modification and settlement instantly.
  * **Bulk Management:** Efficiently add or remove members with automated **email notifications**.

### 📊 **AI-Powered Analytics & Insights**

  * **Visual Spending Overviews:** Interactive **Recharts** display your group and personal spending patterns.
  * **Trend Analysis:** Track **monthly spending trends** to monitor financial health.
  * **Gemini AI Insights:** Receive **AI-powered analysis** via email, including personalized saving tips and budget recommendations.

### ⚖️ **Intelligent Settlements & Debt Resolution**

  * **Net Balance Calculation:** A unified ledger aggregates all debts to provide a **single, clear net balance** across all groups and 1-on-1 debts.
  * **Direction-Aware Validation:** The platform prevents settling in the wrong direction, ensuring financial accuracy.
  * **Automatic Cleanup:** **Orphan cleanup** logic ensures all debts are correctly linked and resolved.

### 🔔 **Proactive Notifications**

  * **Automated Reminders:** **Daily cron jobs** (via Inngest) send payment reminder emails for overdue balances.
  * **Monthly Financial Summary:** Get a detailed **spending insights email** with AI analysis.
  * **Group Activity Alerts:** Stay informed with real-time notifications for group changes and new expenses.

-----

## 🛠️ Tech Stack: Built for Performance & Scalability

Pikofy is engineered using a modern, high-performance stack focusing on **real-time functionality and developer experience.**

\<div align="center"\>
\<table\>
\<tr\>
\<td align="center" width="96"\>
\<img src="[https://skillicons.dev/icons?i=nextjs](https://skillicons.dev/icons?i=nextjs)" width="48" height="48" alt="Next.js" /\>
<br>Next.js 16
\</td\>
\<td align="center" width="96"\>
\<img src="[https://skillicons.dev/icons?i=react](https://skillicons.dev/icons?i=react)" width="48" height="48" alt="React" /\>
<br>React 19
\</td\>
\<td align="center" width="96"\>
\<img src="[https://skillicons.dev/icons?i=tailwind](https://skillicons.dev/icons?i=tailwind)" width="48" height="48" alt="Tailwind" /\>
<br>Tailwind 4
\</td\>
\<td align="center" width="96"\>
\<img src="[https://skillicons.dev/icons?i=typescript](https://skillicons.dev/icons?i=typescript)" width="48" height="48" alt="TypeScript" /\>
<br>TypeScript
\</td\>
\</tr\>
\<tr\>
\<td align="center" width="96"\>
\<img src="[https://convex.dev/favicon.ico](https://convex.dev/favicon.ico)" width="48" height="48" alt="Convex" /\>
<br>Convex
\</td\>
\<td align="center" width="96"\>
\<img src="[https://clerk.com/favicon.ico](https://clerk.com/favicon.ico)" width="48" height="48" alt="Clerk" /\>
<br>Clerk Auth
\</td\>
\<td align="center" width="96"\>
\<img src="[https://skillicons.dev/icons?i=nodejs](https://skillicons.dev/icons?i=nodejs)" width="48" height="48" alt="Node.js" /\>
<br>Inngest
\</td\>
\<td align="center" width="96"\>
\<img src="[https://www.gstatic.com/lamda/images/gemini\_sparkle\_v002\_d4735304ff6292a690345.svg](https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg)" width="48" height="48" alt="Gemini" /\>
<br>Gemini AI
\</td\>
\</tr\>
\</table\>
\</div\>

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 16** (App Router), **React 19**, **Tailwind CSS 4** | Robust, modern web application framework and styling. |
| **Backend/DB** | **Convex** | Serverless backend with a **real-time, reactive database** for instant synchronization. |
| **Authentication** | **Clerk** | Secure and flexible OAuth/Email & Password user authentication. |
| **Background Jobs** | **Inngest** | Reliable platform for scheduling cron jobs and managing long-running workflows (e.g., daily email reminders). |
| **AI Integration** | **Google Gemini** | Generates intelligent spending analysis and personalized tips. |
| **Email Service** | **Nodemailer** | SMTP handler for notifications and reminders. |

-----

## 📸 Project Showcase

\<div align="center"\>

[Image of the Dashboard interface with charts]

\<p\>\<i\>The central dashboard provides a beautiful and intuitive overview of your net balances and spending trends.\</i\>\</p\>

\<p\>\<i\>Flexible expense creation with options for custom splits.\</i\>\</p\>
\</div\>

-----

## 🚀 Getting Started

Follow these steps to set up and run Pikofy locally.

### Prerequisites

You will need the following accounts and tools:

  * **Node.js** 18+ and `npm`/`yarn`/`pnpm`
  * **Convex** account (`convex.dev`)
  * **Clerk** account (`clerk.com`)
  * **Gmail** account (for SMTP)
  * **Google AI API key** (`ai.google.dev`)
  * **Inngest** account (`inngest.com`)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/pikofy.git
    cd pikofy
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Create a file named **`.env.local`** and populate it with your keys:

    ```env
    # Convex
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
    ```

4.  **Set Up Convex Backend**
    This command deploys your schema and functions, and watches for changes.

    ```bash
    npx convex dev
    ```

5.  **Run the Development Server**

    ```bash
    npm run dev
    ```

    Visit **`http://localhost:3000`** in your browser. 🎉

-----

## 📁 Project Structure Overview

The codebase is organized by feature and stack component for clear separation of concerns.

```
pikofy/
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
```

-----

## 🤝 Contributing

We welcome contributions to Pikofy\! Whether it's reporting a bug, suggesting a feature, or submitting code, your help is appreciated.

1.  **Fork** the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  **Open a Pull Request** with a detailed description of your changes.

-----

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

-----

## 🙏 Acknowledgments

A special thank you to the tools and platforms that made this project possible:

  * **Next.js** - The foundational React framework.
  * **Convex** - For providing a fast, real-time, and reactive backend experience.
  * **Clerk** - For painless, secure authentication.
  * **Google Gemini** - For intelligent, AI-powered financial insights.
  * **Inngest** - For reliable background jobs and cron scheduling.

\<div align="center"\>
<br>
Built with ❤️ by the Pikofy Team
\</div\>
