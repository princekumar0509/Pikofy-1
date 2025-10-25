

---

````markdown
# 🚀 Pikofy: The Intelligent Expense Splitting Platform

<div align="center">

**💡 The smartest, fastest, and fairest way to split expenses with friends — powered by AI.**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Click_Here-brightgreen?style=for-the-badge)](YOUR_DEMO_LINK)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)

---

</div>

## ⭐ Why Pikofy?

Tired of messy spreadsheets and awkward “who-owes-who” conversations?  
**Pikofy** is a full-stack, real-time web app designed to make expense splitting **stress-free**.  
It combines a **serverless backend**, **Gemini AI analytics**, and **beautiful UI** to simplify group finance management — whether you’re managing a trip, event, or household.

---

## ✨ Core Features

Pikofy isn’t just about splitting bills — it’s about **clarity, collaboration, and convenience.**

### 💳 Smart Expense Management
- 💰 **Flexible Splitting** — Equal, percentage, or exact shares per member.  
- 🧠 **Auto-Suggest Categories** — AI detects the best expense type for your entry.  
- 📂 **Rich Categorization** — 20+ predefined categories to stay organized.

### 👥 Seamless Group Collaboration
- 🏘️ **Unlimited Groups** — Trips, events, roommates — all supported.  
- 🔒 **Role-Based Access** — Admin/member permissions for safety.  
- ⚡ **Real-Time Logs** — Track updates and settlements live.  
- 📧 **Bulk Management** — Add/remove members with automated notifications.

### 📊 AI-Powered Analytics & Insights
- 📈 **Visual Dashboards** — Interactive Recharts-based overviews.  
- 📅 **Trend Tracking** — Monthly spending visualization.  
- 🤖 **Gemini AI Insights** — Get personalized saving and budgeting advice via email.

### ⚖️ Intelligent Settlements
- 💡 **Net Balance View** — Clear “who owes whom” summary.  
- ✅ **Direction Validation** — Prevents incorrect settlements.  
- 🧹 **Auto Cleanup** — Ensures debts are always properly linked.

### 🔔 Proactive Notifications
- 🕒 **Daily Reminders** — Cron jobs (via Inngest) send payment alerts.  
- 📬 **Monthly Reports** — AI-powered financial summaries.  
- 🔔 **Instant Alerts** — For group changes or new expenses.

---

## 🛠️ Tech Stack

Built for **real-time performance**, **scalability**, and **developer joy**.

<div align="center">

| Frontend | Backend | Auth | AI | Jobs | Email |
|:--:|:--:|:--:|:--:|:--:|:--:|
| ![Next.js](https://skillicons.dev/icons?i=nextjs) <br>**Next.js 16** | ![Convex](https://convex.dev/favicon.ico) <br>**Convex** | ![Clerk](https://clerk.com/favicon.ico) <br>**Clerk Auth** | ![Gemini](https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg) <br>**Gemini AI** | ![Inngest](https://skillicons.dev/icons?i=nodejs) <br>**Inngest** | ![Nodemailer](https://skillicons.dev/icons?i=nodejs) <br>**Nodemailer** |

</div>

---

## 📸 Project Showcase

<div align="center">

🖥️ **Dashboard Overview**  
*A beautiful summary of all your groups, balances, and expense trends.*

📱 **Expense Creation Screen**  
*Add expenses effortlessly with smart AI category suggestions.*

</div>

---

## 🚀 Getting Started

Follow these steps to run Pikofy locally:

### ✅ Prerequisites
- Node.js **v18+**
- Accounts for **Convex**, **Clerk**, **Google AI (Gemini)**, **Inngest**
- A Gmail account (for SMTP notifications)

### 🧩 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/pikofy.git
   cd pikofy
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Add environment variables**
   Create `.env.local`:

   ```env
   # Convex
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CONVEX_DEPLOYMENT=your_deployment

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
   CLERK_SECRET_KEY=your_clerk_secret

   # Gmail SMTP
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASSWORD=your_app_password

   # AI
   GEMINI_API_KEY=your_gemini_key

   # Inngest
   INNGEST_EVENT_KEY=your_inngest_key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Start the Convex backend**

   ```bash
   npx convex dev
   ```

5. **Run the Next.js app**

   ```bash
   npm run dev
   ```

   Visit → **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🗂️ Project Structure

```
pikofy/
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Login/Register
│   ├── (main)/           # Dashboard and Groups
│   └── api/              # Inngest webhooks
├── components/           # UI components (shadcn/ui)
├── convex/               # Serverless backend logic
│   ├── schema.js         # Database schema
│   ├── expenses.js       # Expense logic
│   └── settlements.js    # Settlement logic
├── lib/                  # Utility and integrations
│   └── inngest/          # Cron jobs and background tasks
└── hooks/                # Custom React hooks
```

---

## 🤝 Contributing

We welcome all contributions! 🙌

1. **Fork** this repo.
2. Create a feature branch:

   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:

   ```bash
   git commit -m 'feat: add AmazingFeature'
   ```
4. Push your branch:

   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a **Pull Request**.

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

* **Next.js** — the modern React framework
* **Convex** — real-time backend platform
* **Clerk** — seamless authentication
* **Google Gemini** — AI insights engine
* **Inngest** — event-driven background jobs

---

<div align="center">

💙 Built with passion by the **Pikofy Team**
Let’s make expense sharing effortless ✨

</div>
```

---

### ✅ Key Improvements Made

* Added **badges**, emojis, and consistent iconography.
* Centered hero section for a professional **first impression**.
* Replaced repetitive text with **concise, bold phrasing**.
* Made sections like *Tech Stack* and *Getting Started* more **developer-friendly**.
* Highlighted demo and structure visually.
* Ensured Markdown renders cleanly on **GitHub and VS Code previews**.

Would you like me to make a **minimal variant** (less flashy, more corporate-looking) version too — for professional submission or internship portfolios?


<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/2801d697-3ab7-4b01-97cc-01696fed2c58" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/39e84f93-a73e-48db-b0f5-d392b7791d3b" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/9337bf01-ee98-4d4b-99bb-c7a10668b944" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/381feeae-7e86-46f3-9857-3e6926e44503" />
<img width="1906" height="920" alt="image" src="https://github.com/user-attachments/assets/d02c5c74-5955-48e5-8753-f8d45911307c" />
<img width="1026" height="919" alt="image" src="https://github.com/user-attachments/assets/04d4df89-2a5d-4db8-ac11-cb2bd8feabc4" />






