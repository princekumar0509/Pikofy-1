import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { inngest } from "./client";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

/* Gemini model - using models/gemini-flash-latest */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "models/gemini-flash-latest" });

export const spendingInsights = inngest.createFunction(
  { name: "Generate Spending Insights", id: "generate-spending-insights" },
  { cron: "30 4 1 * *" }, // Monthly on 1st at 10:00 AM IST (4:30 AM UTC)
  async ({ step }) => {
    /* ─── 1. Pull users with expenses this month ────────────────────── */
    const users = await step.run("Fetch users with expenses", async () => {
      return await convex.query(api.inngest.getUsersWithExpenses);
    });

    /* ─── 2. Iterate users & send insight email ─────────────────────── */
    const results = [];

    for (const user of users) {
      /* a. Pull last-month expenses (skip if none) */
      const expenses = await step.run(`Expenses · ${user._id}`, () =>
        convex.query(api.inngest.getUserMonthlyExpenses, { userId: user._id })
      );
      if (!expenses?.length) continue;

      /* b. Build JSON blob for the prompt */
      const expenseData = JSON.stringify({
        expenses,
        totalSpent: expenses.reduce((sum, e) => sum + e.amount, 0),
        categories: expenses.reduce((cats, e) => {
          cats[e.category ?? "uncategorised"] =
            (cats[e.category] ?? 0) + e.amount;
          return cats;
        }, {}),
      });

      /* c. Calculate summary stats */
      const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
      const categories = expenses.reduce((cats, e) => {
        const cat = e.category ?? "Uncategorized";
        cats[cat] = (cats[cat] || 0) + e.amount;
        return cats;
      }, {});
      const topCategories = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      /* d. Prompt + AI call using step.ai.wrap (retry-aware) */
      const prompt = `
As a friendly financial advisor, review this user's spending and provide helpful insights.
Keep your response VERY concise and easy to scan. Format as HTML list items.

User spending data:
${expenseData}

Provide EXACTLY 4 bullet points:
1. One sentence overview of their spending this month (be specific with the amount)
2. Key observation about their top spending category (mention the category name)
3. One specific, actionable money-saving tip
4. An encouraging statement about their financial habits

Format each point as: <li>Brief sentence here</li>
Keep each point to ONE sentence only. Be friendly and positive.
      `.trim();

      try {
        const aiResponse = await step.ai.wrap(
          "gemini",
          async (p) => model.generateContent(p),
          prompt
        );

        const aiInsights =
          aiResponse.response.candidates[0]?.content.parts[0]?.text ?? "";

        /* e. Build beautiful email HTML */
        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">💰 Your Monthly Spending Insights</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 14px;">Powered by Pikofy AI</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0; font-size: 16px; color: #1e293b; line-height: 1.6;">
                Hi <strong>${user.name}</strong>,
              </p>
              <p style="margin: 10px 0 0 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                Here's your personalized spending analysis for the past month! 📊
              </p>
            </td>
          </tr>

          <!-- Stats Cards -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 10px;">
                    <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; border-radius: 8px;">
                      <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total Spent</p>
                      <p style="margin: 8px 0 0 0; font-size: 28px; color: #0ea5e9; font-weight: 700;">$${totalSpent.toFixed(2)}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 10px;">
                    <div style="background-color: #f0fdfa; border-left: 4px solid: #14b8a6; padding: 20px; border-radius: 8px;">
                      <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Transactions</p>
                      <p style="margin: 8px 0 0 0; font-size: 28px; color: #14b8a6; font-weight: 700;">${expenses.length}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Top Categories -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #1e293b;">Top Spending Categories</h2>
              ${topCategories.map(([category, amount], idx) => `
                <div style="background-color: #f8fafc; padding: 15px 20px; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid ${idx === 0 ? '#0ea5e9' : idx === 1 ? '#14b8a6' : '#8b5cf6'};">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 15px; color: #1e293b; font-weight: 600;">${category}</span>
                    <span style="font-size: 16px; color: #0ea5e9; font-weight: 700;">$${amount.toFixed(2)}</span>
                  </div>
                </div>
              `).join('')}
            </td>
          </tr>

          <!-- AI Insights -->
          <tr>
            <td style="padding: 0 30px 20px 30px;">
              <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #1e293b;">💡 Smart Insights</h2>
              <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 8px; padding: 20px;">
                <ul style="margin: 0; padding: 0; list-style: none;">
                  ${aiInsights.replace(/<li>/g, '<li style="padding: 10px 0 10px 30px; position: relative; color: #1e293b; font-size: 15px; line-height: 1.6;"><span style="position: absolute; left: 0; top: 10px; width: 6px; height: 6px; background: #0ea5e9; border-radius: 50%;"></span>').replace(/<\/li>/g, '</li>')}
                </ul>
              </div>
            </td>
          </tr>

          <!-- Money-Saving Tips -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #1e293b;">💰 Ways to Save Next Month</h2>
              ${topCategories.slice(0, 2).map(([category, amount]) => {
                const tips = {
                  'Food': 'Meal prep on Sundays to reduce eating out by 30%',
                  'Transport': 'Consider carpooling or public transport for daily commutes',
                  'Entertainment': 'Look for free community events and streaming alternatives',
                  'Shopping': 'Wait 24 hours before non-essential purchases',
                  'Bills': 'Review subscriptions and cancel unused services',
                  'Healthcare': 'Use generic medicines and preventive care',
                  'Travel': 'Book flights 6-8 weeks in advance for better deals',
                  'Education': 'Explore free online courses before paid options',
                  'Groceries': 'Make a shopping list and buy in bulk for staples',
                  'Utilities': 'Use energy-saving modes and unplug unused devices'
                };
                const tip = tips[category] || 'Track this category closely and set a monthly budget';
                return `
                  <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 8px; margin-bottom: 12px;">
                    <div style="display: flex; align-items: start; gap: 12px;">
                      <span style="font-size: 20px; line-height: 1;">💡</span>
                      <div style="flex: 1;">
                        <p style="margin: 0 0 5px 0; font-size: 14px; color: #065f46; font-weight: 600;">${category} (You spent $${amount.toFixed(2)})</p>
                        <p style="margin: 0; font-size: 14px; color: #047857; line-height: 1.5;">${tip}</p>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
              <div style="background-color: #fef9c3; border-left: 4px solid #eab308; padding: 15px 20px; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #854d0e; line-height: 1.6;">
                  <strong>Pro Tip:</strong> Set up automatic transfers to savings right after payday - you won&apos;t miss what you don&apos;t see! 🎯
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">
                Made with ❤️ by <strong style="color: #0ea5e9;">Pikofy</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Keep tracking your expenses to build better financial habits!
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim();

        /* f. Send the email */
        await step.run(`Email · ${user._id}`, () =>
          convex.action(api.email.sendEmail, {
            to: user.email,
            subject: "💰 Your Monthly Spending Insights from Pikofy",
            html: emailHTML,
            gmailUser: process.env.GMAIL_USER,
            gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
          })
        );

        results.push({ userId: user._id, success: true });
      } catch (err) {
        results.push({
          userId: user._id,
          success: false,
          error: err.message,
        });
      }
    }

    /* ─── 3. Summary for the cron log ───────────────────────────────── */
    return {
      processed: results.length,
      success: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };
  }
);