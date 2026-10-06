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
