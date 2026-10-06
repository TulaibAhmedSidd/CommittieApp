import nodemailer from "nodemailer";

// One shared mail sender. It never throws: email is a bonus, the app must work without it.
// MAIL_MODE=log prints emails to the server console instead of sending (development).

let transporter = null;

function getTransporter() {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
    });
  }
  return transporter;
}

export function appUrl(path = "") {
  const base = (process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return base + (path.startsWith("/") ? path : `/${path}`);
}

export async function sendMail({ to, subject, html }) {
  if (!to) return { skipped: "no-recipient" };
  if (process.env.MAIL_MODE === "log") {
    console.log(`[mail:log] to=${to} subject="${subject}"\n${html}\n`);
    return { logged: true };
  }
  const t = getTransporter();
  if (!t) return { skipped: "no-smtp" };
  try {
    await Promise.race([
      t.sendMail({ from: `"CommittieApp" <${process.env.SMTP_EMAIL}>`, to, subject, html }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("mail timeout")), 5000)),
    ]);
    return { sent: true };
  } catch (err) {
    console.error("[mail] failed:", err?.message);
    return { failed: true };
  }
}
