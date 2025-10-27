# 🚀 Pikofy: The Intelligent Expense Splitting Platform
## WEBSITE LINK: [link](https://pikofy-1.vercel.app)
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





## 📸 Application Screenshots



### Homepage Interface
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/2801d697-3ab7-4b01-97cc-01696fed2c58" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/39e84f93-a73e-48db-b0f5-d392b7791d3b" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/9337bf01-ee98-4d4b-99bb-c7a10668b944" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/381feeae-7e86-46f3-9857-3e6926e44503" />

### Main Dashboard
<img width="1409" height="928" alt="image" src="https://github.com/user-attachments/assets/48fcbe27-7ad9-4366-91a7-51883e9dca85" />

### Create Expense
<img width="1026" height="919" alt="image" src="https://github.com/user-attachments/assets/04d4df89-2a5d-4db8-ac11-cb2bd8feabc4" />


### Group Administration
<img width="1405" height="397" alt="image" src="https://github.com/user-attachments/assets/ea829775-64ab-45fd-afa8-9169a166aa5d" />

<img width="1210" height="923" alt="image" src="https://github.com/user-attachments/assets/f436eaea-6d94-4c3b-8113-726fb0e4970c" />


### Payment Settlement
<img width="1210" height="747" alt="image" src="https://github.com/user-attachments/assets/0d4494fd-18d4-4ccf-9561-42c61e623393" />

### Email Notification System
<img width="1776" height="733" alt="image" src="https://github.com/user-attachments/assets/1056b7f8-053b-4b9f-9db2-3085e15b6ed6" />


#### Payment Reminder Notification
<img width="1920" height="927" alt="image" src="https://github.com/user-attachments/assets/1efa7858-3768-4f9f-aa40-e3c32465e258" />

#### Monthly Analytics Report
<img width="1920" height="927" alt="image" src="https://github.com/user-attachments/assets/8d41e68a-6859-4770-b7e6-be2eb8c9c699" />

#### Group Membership Invitation
<img width="1912" height="920" alt="image" src="https://github.com/user-attachments/assets/f90afe6c-651b-4296-be85-6709f64ec98e" />

### Backend Administration Panels

#### Convex Control Panel
<img width="1912" height="923" alt="image" src="https://github.com/user-attachments/assets/3fa4463f-02db-4f7b-80fa-f4a01d14e3a9" />
<img width="1912" height="923" alt="image" src="https://github.com/user-attachments/assets/db2b9492-212a-4163-bfa3-1e0d9c6a3d21" />
<img width="1912" height="923" alt="image" src="https://github.com/user-attachments/assets/b76f0ae9-44f2-4db9-8f93-17ea430eb0c4" />

#### Inngest Job Monitor
<img width="1912" height="924" alt="image" src="https://github.com/user-attachments/assets/20cddfed-ded7-45e9-81d1-037e4a553700" />



---

## 🚀 Installation & Setup Guide

### Required Dependencies
- Node.js version 18 or higher with npm package manager
- Active Convex account (sign up at [convex.dev](https://www.convex.dev/))
- Active Clerk account (register at [clerk.com](https://clerk.com/))
- Gmail account for email service integration

### Setup Instructions

**1. Repository Setup**
```bash
git clone https://github.com/yourusername/pikofy.git
cd pikofy
```

**2. Package Installation**
```bash
npm install
```

**3. Initialize Convex Backend**
```bash
npx convex dev
```
*Note: This command automatically generates `.env.local` containing `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`*

**4. Environment Configuration**

Create a `.env.local` file in your project root:

```env
# Convex Backend Configuration
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Inngest Configuration (Optional)
INNGEST_EVENT_KEY=your-event-key
INNGEST_SIGNING_KEY=your-signing-key
```

**5. Configure Convex Backend Variables**

Navigate to **Convex Dashboard → Production → Environment Variables** and add:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CLERK_JWT_ISSUER_DOMAIN=your-clerk-domain.clerk.accounts.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**6. Launch Development Environment**

Open two terminal windows:

```bash
# Terminal Window 1: Start Convex
npx convex dev

# Terminal Window 2: Start Next.js
npm run dev
```

**7. Access the Application**
- Open your browser and navigate to [http://localhost:3000](http://localhost:3000)
- Create an account and begin using Pikofy!

---

## 🌐 Production Deployment

### Vercel Deployment Process

**Step 1: Initialize Git Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/pikofy.git
git push -u origin main
```

**Step 2: Vercel Deployment**
- Visit [vercel.com](https://vercel.com/) and sign in
- Select "Import Project" and connect your GitHub repository
- **Build Configuration:** `npx convex deploy && next build`
- Import all environment variables from your `.env.local` file
- Initiate deployment by clicking **Deploy**

**Step 3: Post-Deployment Configuration**
- In Convex Dashboard, update `NEXT_PUBLIC_APP_URL` with your production Vercel URL
- Add your production domain to Clerk's **Allowed Origins** list
- (Optional) Configure Inngest: Either use Vercel's native integration or set up manual synchronization

---

### 1. Convex Real-Time Database Integration
**Rationale:** Eliminates the need for manual page refreshes by providing live data synchronization

**Implementation:** Leverages Convex's reactive query system that automatically pushes updates to all connected clients in real-time

### 2. Balance Computation Strategy
Developed a comprehensive 4-phase balance calculation approach:
- **Phase 1:** Aggregate all transactions involving the current user
- **Phase 2:** Compute individual user balances from transaction data
- **Phase 3:** Factor in all payment settlements to update balances
- **Phase 4:** Generate display-ready lists and calculate aggregate totals

### 3. Database Query Optimization
- Strategic indexing on high-frequency query fields
- Performance improvement: O(n) → O(log n) time complexity
- Essential for maintaining responsive dashboard interactions

### 4. Scheduled Task Management via Inngest
- **Daily Notifications:** Payment alerts dispatched at 10:00 AM IST
- **Monthly Reports:** Comprehensive spending analysis sent on the 1st at 10:00 AM IST
- Asynchronous execution prevents blocking the main application thread

---

## 📧 Email Configuration Guide

### Setting Up Gmail SMTP

**Step 1: Activate Two-Factor Authentication**
- Navigate to [Google Account Security Settings](https://myaccount.google.com/security)
- Turn on 2-Step Verification

**Step 2: Create Application Password**
- Access [App Password Generator](https://myaccount.google.com/apppasswords)
- Generate a new password for "Mail" application
- Save this credential as `GMAIL_APP_PASSWORD`

**Step 3: Convex Configuration**
- Add `GMAIL_USER` and `GMAIL_APP_PASSWORD` to your Convex environment variables

---

## 🎓 Skills & Technologies Demonstrated

This application showcases proficiency in:

✅ Modern full-stack development using Next.js 16 and React 19

✅ Real-time data synchronization with Convex backend

✅ User authentication and authorization via Clerk

✅ Automated task scheduling using Inngest framework

✅ SMTP email integration with Nodemailer

✅ Advanced database architecture and performance optimization

✅ Modern UI development with Tailwind CSS and shadcn/ui components

✅ Client-side validation using React Hook Form and Zod schemas

✅ Comprehensive error handling and user experience design

✅ Production deployment and environment configuration

---

## 🙏 Technology Credits

- **Next.js** - Production-ready React framework
- **Convex** - Serverless real-time backend solution
- **Clerk** - Modern authentication platform
- **Inngest** - Reliable background job scheduler
- **shadcn/ui** - Premium UI component collection
- **Radix UI** - Headless accessible UI primitives
- **Tailwind CSS** - Utility-first styling framework



