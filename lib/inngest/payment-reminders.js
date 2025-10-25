import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { inngest } from "./client";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export const paymentReminders = inngest.createFunction(
  { id: "send-payment-reminders" },
  { cron: "30 4 * * *" }, // Daily at 10:00 AM IST (4:30 AM UTC)
  async ({ step }) => {
    /* 1. fetch all users that still owe money */
    const users = await step.run("fetch‑debts", () =>
      convex.query(api.inngest.getUsersWithOutstandingDebts)
    );

    /* 2. build & send one e‑mail per user */
    const results = await step.run("send‑emails", async () => {
      return Promise.all(
        users.map(async (u) => {
          if (!u.debts?.length) return { userId: u._id, skipped: true };

          const totalOwed = u.debts.reduce((sum, d) => sum + d.amount, 0);
          
          const debtCards = u.debts
            .map(
              (d) => `
                <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                  <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b 0%, #fb923c 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);">
                      ${d.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style="margin: 0; font-size: 17px; color: #1e293b; font-weight: 700;">${d.name}</p>
                      <p style="margin: 5px 0 0 0; font-size: 13px; color: #92400e;">📅 Since ${new Date(d.since).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <p style="margin: 0; font-size: 24px; color: #ea580c; font-weight: 700;">$${d.amount.toFixed(2)}</p>
                  </div>
                </div>
              `
            )
            .join("");

          const html = `
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
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">💳 Friendly Payment Reminder</h1>
              <p style="margin: 10px 0 0 0; color: #e0f2fe; font-size: 14px;">From Pikofy</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0; font-size: 16px; color: #1e293b; line-height: 1.6;">
                Hi <strong>${u.name}</strong>,
              </p>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                This is a friendly reminder that you have <strong style="color: #ea580c;">${u.debts.length} pending payment${u.debts.length > 1 ? 's' : ''}</strong> on Pikofy.
              </p>
            </td>
          </tr>

          <!-- Total Owed -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 13px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Total Outstanding Balance</p>
                <p style="margin: 8px 0 0 0; font-size: 32px; color: #ea580c; font-weight: 700;">$${totalOwed.toFixed(2)}</p>
              </div>
            </td>
          </tr>

          <!-- Outstanding Balances -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #1e293b;">💳 Who You Owe</h2>
              ${debtCards}
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 30px 30px 30px; text-align: center;">
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #64748b; line-height: 1.6;">
                Please settle these balances at your earliest convenience. Your friends are counting on you! 🙏
              </p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Settle Up on Pikofy
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">
                Made with ❤️ by <strong style="color: #0ea5e9;">Pikofy</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Keep your finances organized and friendships strong!
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

          try { 
            await convex.action(api.email.sendEmail, {
              to: u.email,
              subject: "💳 Payment Reminder: You have pending balances on Pikofy",
              html,
              gmailUser: process.env.GMAIL_USER,
              gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
            });
            return { userId: u._id, success: true };
          } catch (err) {
            return { userId: u._id, success: false, error: err.message };
          }
        })
      );
    });

    return {
      processed: results.length,
      successes: results.filter((r) => r.success).length,
      failures: results.filter((r) => r.success === false).length,
    };
  }
);