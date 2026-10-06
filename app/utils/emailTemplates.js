import { appUrl } from "./mailer";

// Short emails with English + Urdu. All user text is escaped.

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function layout({ title, en, ur, button, link }) {
  return `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
  <h2 style="color:#065f46;margin:0 0 12px">${esc(title)}</h2>
  <p style="font-size:15px;color:#111827;line-height:1.5">${en}</p>
  <p dir="rtl" style="font-size:16px;color:#374151;line-height:1.8;font-family:'Noto Nastaliq Urdu',serif">${ur}</p>
  ${link ? `<p style="margin:20px 0"><a href="${esc(link)}" style="background:#047857;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">${esc(button)}</a></p>` : ""}
  <p style="font-size:12px;color:#6b7280">CommittieApp</p>
</div>`;
}

export const emails = {
  joinApproved: ({ name, bcName, bcId }) => ({
    subject: `You are in: ${bcName}`,
    html: layout({
      title: "Request approved",
      en: `Hi ${esc(name)}, you are now a member of <b>${esc(bcName)}</b>.`,
      ur: `آپ <b>${esc(bcName)}</b> کمیٹی میں شامل ہو گئے ہیں۔`,
      button: "Open BC",
      link: appUrl(`/userDash/bc/${bcId}`),
    }),
  }),

  bcStarted: ({ name, bcName, bcId, turnLabel, amountText }) => ({
    subject: `${bcName} has started`,
    html: layout({
      title: "Your BC has started",
      en: `Hi ${esc(name)}, <b>${esc(bcName)}</b> has started. Your turn: <b>${esc(turnLabel)}</b> (${esc(amountText)}).`,
      ur: `<b>${esc(bcName)}</b> شروع ہو گئی ہے۔ آپ کی باری: <b>${esc(turnLabel)}</b>`,
      button: "Open BC",
      link: appUrl(`/userDash/bc/${bcId}`),
    }),
  }),

  payoutRecorded: ({ name, bcName, bcId, amountText }) => ({
    subject: `Payout sent: ${bcName}`,
    html: layout({
      title: "You got your payout",
      en: `Hi ${esc(name)}, your organizer has given your payout of <b>${esc(amountText)}</b> for <b>${esc(bcName)}</b>.`,
      ur: `آپ کی کمیٹی کی رقم <b>${esc(amountText)}</b> دے دی گئی ہے۔`,
      button: "See details",
      link: appUrl(`/userDash/bc/${bcId}`),
    }),
  }),

  invite: ({ name, organizerName, link }) => ({
    subject: `${organizerName} added you to CommittieApp`,
    html: layout({
      title: "You are invited",
      en: `Hi ${esc(name)}, ${esc(organizerName)} added you. Tap the button to set your password. The link works for 7 days.`,
      ur: `${esc(organizerName)} نے آپ کو شامل کیا ہے۔ اپنا پاس ورڈ بنانے کے لیے بٹن دبائیں۔`,
      button: "Set password",
      link,
    }),
  }),

  passwordReset: ({ name, link }) => ({
    subject: "Reset your password",
    html: layout({
      title: "Reset password",
      en: `Hi ${esc(name)}, tap the button to set a new password. The link works for 1 hour. If you did not ask for this, ignore this email.`,
      ur: `نیا پاس ورڈ بنانے کے لیے بٹن دبائیں۔`,
      button: "Set new password",
      link,
    }),
  }),

  organizerApproved: ({ name }) => ({
    subject: "Your organizer account is approved",
    html: layout({
      title: "Account approved",
      en: `Hi ${esc(name)}, your organizer account is approved. You can now log in and create a BC.`,
      ur: `آپ کا آرگنائزر اکاؤنٹ منظور ہو گیا ہے۔ اب آپ کمیٹی بنا سکتے ہیں۔`,
      button: "Log in",
      link: appUrl("/login"),
    }),
  }),
};
