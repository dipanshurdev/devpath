/**
 * Transactional email service using Resend.
 * Falls back to console logging in development when RESEND_API_KEY is not set.
 */

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "DevPath <onboarding@devpath.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev fallback — log to console
    console.log("[EMAIL] Would send email (no RESEND_API_KEY set):");
    console.log(`  To: ${payload.to}`);
    console.log(`  Subject: ${payload.subject}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[EMAIL] Resend error:", body);
    // Don't throw — email failures shouldn't break auth flows
  }
}

// ── Templates ──────────────────────────────────────────────────────────────

function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fafafa; margin: 0; padding: 0; }
          .container { max-width: 560px; margin: 48px auto; background: #fff; border: 1px solid #e5e5e5; padding: 40px; }
          .logo { font-size: 20px; font-weight: 700; color: #111; margin-bottom: 32px; }
          h1 { font-size: 22px; font-weight: 700; color: #111; margin: 0 0 12px; }
          p { font-size: 15px; color: #444; line-height: 1.6; margin: 0 0 16px; }
          .btn { display: inline-block; background: #111; color: #fff !important; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 600; margin: 16px 0; }
          .footer { margin-top: 32px; font-size: 12px; color: #999; }
          hr { border: none; border-top: 1px solid #e5e5e5; margin: 24px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">DevPath 🗺️</div>
          ${content}
          <hr />
          <div class="footer">You're receiving this email because you have an account at DevPath. If you didn't sign up, you can safely ignore this.</div>
        </div>
      </body>
    </html>
  `;
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Welcome to DevPath 🎉",
    html: baseTemplate(`
      <h1>Welcome, ${name}!</h1>
      <p>You're in. DevPath is your home for curated developer learning roadmaps — built to help you go from zero to production-ready, step by step.</p>
      <p>Start by exploring our roadmaps:</p>
      <a href="${APP_URL}/roadmaps" class="btn">Explore Roadmaps →</a>
      <p>Track your progress, earn achievements, and build in public. We're glad you're here.</p>
      <p>– The DevPath Team</p>
    `),
  });
}

export async function sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to,
    subject: "Reset your DevPath password",
    html: baseTemplate(`
      <h1>Reset your password</h1>
      <p>We received a request to reset the password for your DevPath account.</p>
      <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
      <a href="${resetUrl}" class="btn">Reset Password →</a>
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
    `),
  });
}

export async function sendSubscriptionConfirmationEmail(
  to: string,
  name: string,
  tier: string,
): Promise<void> {
  await sendEmail({
    to,
    subject: `Your DevPath ${tier} subscription is active`,
    html: baseTemplate(`
      <h1>Subscription confirmed ✓</h1>
      <p>Hi ${name}, your <strong>DevPath ${tier}</strong> subscription is now active.</p>
      <p>You now have access to all ${tier} features including:</p>
      ${tier === "PRO" ? `
        <ul style="color:#444;font-size:15px;line-height:1.8;">
          <li>Create unlimited custom roadmaps</li>
          <li>Premium learning resources</li>
          <li>Advanced analytics</li>
          <li>AI-powered recommendations</li>
        </ul>
      ` : `
        <ul style="color:#444;font-size:15px;line-height:1.8;">
          <li>Everything in Pro</li>
          <li>Team collaboration (up to 25 members)</li>
          <li>Shared progress tracking</li>
          <li>Priority support</li>
        </ul>
      `}
      <a href="${APP_URL}/dashboard" class="btn">Go to Dashboard →</a>
      <p>Thank you for supporting DevPath.</p>
    `),
  });
}

export async function sendSubscriptionCancelledEmail(to: string, name: string, periodEnd: Date): Promise<void> {
  await sendEmail({
    to,
    subject: "Your DevPath subscription has been cancelled",
    html: baseTemplate(`
      <h1>Subscription cancelled</h1>
      <p>Hi ${name}, we've cancelled your DevPath subscription as requested.</p>
      <p>Your access continues until <strong>${periodEnd.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong>, after which your account will revert to the Free tier.</p>
      <p>Changed your mind? You can resubscribe anytime from your account settings.</p>
      <a href="${APP_URL}/pricing" class="btn">Resubscribe →</a>
    `),
  });
}
