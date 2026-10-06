import { normalizePkPhone } from "./phone";

/**
 * Build a WhatsApp link. With a phone it opens that chat,
 * without a phone it opens WhatsApp's "share to" picker.
 */
export function waLink(phone, text = "") {
  const n = phone ? normalizePkPhone(phone) : null;
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return n ? `https://wa.me/${n.slice(1)}${q}` : `https://wa.me/${q}`;
}
