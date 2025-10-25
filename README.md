# 🚀 Pikofy: The Intelligent Expense Splitting Platform
## Live Demo: https://pikofy-1.vercel.app
## 📖 About The Project
 **Pikofy** is a **full-stack, real-time expense-sharing app** for the Indian market that simplifies bill splitting and group finances with instant updates and **smart settlement suggestions**.
## 🎯 Problem Statement: The Friction of Manual Expense Tracking
 Manually managing shared expenses is stressful and inefficient, often leading to three core issues:
   ### 1. Confusion 🤯: Lack of a clear ledger makes tracking who paid what difficult, causing arguments over balances.
   ### 2. Complexity 📉: Users struggle to determine their true net balance across multiple groups and individual debts.
   ### 3. Awkwardness ⏳: Forgotten payments necessitate uncomfortable, manual reminders, straining relationships.
## 💡 The Pikofy Solution

Pikofy offers a centralized, automated platform that eliminates financial friction by providing:

* **Effortless Tracking** 📲: **Split and track expenses** with speed and accuracy.
* **Automatic Clarity** 🧮: **Instantly calculate net balances** across all debts.
* **Proactive Reminders** 📧: **Automate timely payment reminders** to ensure timely settlements.
* **Smart Insights** 📊: Deliver **deep spending insights and AI-powered analytics** for smarter financial decisions.

## 🚀 Core Features (Condensed)

Pikofy provides a set of highly efficient tools to manage shared finances:

* **Expense & Group Management:** **Flexible splits** (equal, percent, exact), **AI categorization**, real-time sync, and **role-based group access**.
* **Smart Settlements & Analytics:** Instantly calculate **net balances**, get **optimized settlement suggestions**, and view spending trends via the dashboard.
* **Automated Notifications:** Timely **daily payment reminders** and monthly emails with **AI-powered saving insights**.
## 🛠️ Tech Stack (Quick View)

Pikofy is built on a high-performance stack for real-time data and reliability:

* **Frontend:** **Next.js 16 (App Router)** & **React 19** for speed; **Tailwind CSS 4** for styling; **Zod** for validation.
* **Backend & DB:** **Convex** (BaaS) provides **real-time sync** and the database; **Clerk** handles secure authentication.
* **Automation & AI:** **Inngest** runs reliable **cron jobs** (reminders); **Google Gemini** powers AI insights.
* **Email:** **Nodemailer** sends all notifications.

<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/2801d697-3ab7-4b01-97cc-01696fed2c58" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/39e84f93-a73e-48db-b0f5-d392b7791d3b" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/9337bf01-ee98-4d4b-99bb-c7a10668b944" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/381feeae-7e86-46f3-9857-3e6926e44503" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/d02c5c74-5955-48e5-8753-f8d45911307c" />
<img width="1026" height="919" alt="image" src="https://github.com/user-attachments/assets/04d4df89-2a5d-4db8-ac11-cb2bd8feabc4" />



🔑 Key Technical Decisions
1. Real-time Data with Convex
Why? Instant updates across all devices without manual refresh
How? Convex provides reactive queries that update automatically
2. Optimized Balance Calculations
Implemented 4-step consistent calculation logic:

Get all expenses where user is involved
Calculate net balance per user from expenses
Apply all settlements to adjust net balances
Build UI lists and calculate global totals
3. Smart Indexing
Indexes on frequently queried fields
Reduces query time from O(n) to O(log n)
Critical for dashboard performance
4. Background Jobs with Inngest
Payment Reminders: Daily at 10 AM IST
Spending Insights: Monthly on 1st at 10 AM IST
Runs reliably without blocking main application
📧 Email Notifications
Gmail SMTP Setup
Enable 2-Step Verification

Go to Google Account Security
Enable 2-Step Verification
Generate App Password

Go to App Passwords
Create password for "Mail"
Use this as GMAIL_APP_PASSWORD
Configure in Convex

Add GMAIL_USER and GMAIL_APP_PASSWORD to Convex environment variables
🎓 Learning Outcomes
This project demonstrates:

✅ Full-stack development with modern React (Next.js 16)
✅ Real-time backend architecture (Convex)
✅ Authentication implementation (Clerk)
✅ Background job scheduling (Inngest)
✅ Email automation (Nodemailer)
✅ Database design and indexing
✅ Responsive UI design (Tailwind CSS + shadcn/ui)
✅ Form validation (React Hook Form + Zod)
✅ Error handling and user feedback
✅ Deployment and production setup
🙏 Acknowledgments
Next.js - The React Framework
Convex - Real-time backend platform
Clerk - Authentication service
Inngest - Background job orchestration
shadcn/ui - Beautiful component library
Radix UI - Accessible component primitives
Tailwind CSS - Utility-first CSS framework





