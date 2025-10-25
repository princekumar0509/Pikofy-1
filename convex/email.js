"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import nodemailer from "nodemailer";

// Action to send email using Gmail SMTP via Nodemailer 
export const sendEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
    gmailUser: v.string(),
    gmailAppPassword: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Create transporter with Gmail SMTP
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: args.gmailUser,
          pass: args.gmailAppPassword,
        },
      });

      // Send email
      const info = await transporter.sendMail({
        from: `"Pikofy Alerts" <${args.gmailUser}>`,
        to: args.to,
        subject: args.subject,
        text: args.text || "",
        html: args.html,
      });

      console.log("✅ Email sent successfully to:", args.to);
      console.log("   Message ID:", info.messageId);

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Failed to send email to:", args.to);
      console.error("   Error:", error.message);
      return { success: false, error: error.message };
    }
  },
});

// Internal action to send group invite notification
export const sendGroupInviteNotification = internalAction({
  args: {
    recipientEmail: v.string(),
    recipientName: v.string(),
    groupName: v.string(),
    inviterName: v.string(),
  },
  handler: async (ctx, { recipientEmail, recipientName, groupName, inviterName }) => {
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    // Silently skip if credentials not available (graceful degradation)
    if (!gmailUser || !gmailAppPassword) {
      console.log("⚠️ Gmail credentials not configured - skipping group invite email");
      return { success: true, skipped: true };
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          
          <!-- Header with gradient -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">
              🎉 You've Been Added to a Group!
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; color: #333; margin: 0 0 20px 0;">
              Hi <strong>${recipientName}</strong>,
            </p>

            <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 24px 0;">
              <strong>${inviterName}</strong> has added you to the group <strong>"${groupName}"</strong> on Pikofy.
            </p>

            <!-- Info Box -->
            <div style="background: linear-gradient(to right, #e0e7ff, #fce7f3); border-left: 4px solid #667eea; padding: 20px; margin: 24px 0; border-radius: 8px;">
              <p style="margin: 0; font-size: 15px; color: #333; line-height: 1.6;">
                💡 <strong>What's Next?</strong><br>
                You can now:<br>
                • View and add expenses for this group<br>
                • See group balances<br>
                • Settle up with other members<br>
                • Collaborate on shared expenses
              </p>
            </div>

            <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 24px 0;">
              Visit Pikofy to start managing expenses with your group!
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/contacts" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                View Group
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6c757d;">
              Happy expense tracking! 💰
            </p>
            <p style="margin: 0; font-size: 12px; color: #adb5bd;">
              © ${new Date().getFullYear()} Pikofy. The smartest way to split expenses with friends.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    const text = `
Hi ${recipientName},

${inviterName} has added you to the group "${groupName}" on Pikofy.

You can now:
• View and add expenses for this group
• See group balances
• Settle up with other members
• Collaborate on shared expenses

Visit Pikofy to start managing expenses with your group!

Happy expense tracking!

© ${new Date().getFullYear()} Pikofy
    `;

    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      const info = await transporter.sendMail({
        from: `"Pikofy" <${gmailUser}>`,
        to: recipientEmail,
        subject: `You've been added to "${groupName}" on Pikofy`,
        text,
        html,
      });

      console.log("✅ Group invite email sent to:", recipientEmail);
      console.log("   Message ID:", info.messageId);

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ Failed to send group invite email to:", recipientEmail);
      console.error("   Error:", error.message);
      return { success: false, error: error.message };
    }
  },
});