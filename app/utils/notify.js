import Notification from "../api/models/Notification";
import { sendMail } from "./mailer";

/**
 * In-app notification + optional email. Never throws.
 * notify({ recipient: memberDoc, model: "Member", message, link, type, email: { subject, html } })
 */
export async function notify({ recipient, model, message, link, type = "info", sender, senderModel, details, email }) {
  try {
    await Notification.create({
      recipient: recipient._id || recipient,
      recipientModel: model,
      sender,
      senderModel,
      type,
      message,
      link,
      details,
    });
  } catch (err) {
    console.error("[notify] in-app failed:", err?.message);
  }
  if (email && recipient?.email) {
    await sendMail({ to: recipient.email, ...email });
  }
}

/** Many notifications at once: one insert, emails sent 5 at a time. Never throws. */
export async function notifyMany(items) {
  if (!items.length) return;
  try {
    await Notification.insertMany(
      items.map((n) => ({
        recipient: n.recipient._id || n.recipient,
        recipientModel: n.model,
        sender: n.sender,
        senderModel: n.senderModel,
        type: n.type || "info",
        message: n.message,
        link: n.link,
        details: n.details,
      }))
    );
  } catch (err) {
    console.error("[notify] insertMany failed:", err?.message);
  }
  const mails = items.filter((n) => n.email && n.recipient?.email);
  for (let i = 0; i < mails.length; i += 5) {
    await Promise.allSettled(mails.slice(i, i + 5).map((n) => sendMail({ to: n.recipient.email, ...n.email })));
  }
}
