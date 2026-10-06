// Pakistani phone helpers. Canonical format is E.164: "+923001234567".

/**
 * Normalize a Pakistani mobile number to "+923XXXXXXXXX".
 * Accepts: 03001234567, 3001234567 (old numeric values lost the 0),
 * 923001234567, +923001234567, 00923001234567, with spaces/dashes.
 * Returns null when it does not look like a PK mobile number.
 */
export function normalizePkPhone(input) {
  if (input === null || input === undefined) return null;
  let digits = String(input).replace(/[^\d+]/g, "");
  if (!digits) return null;

  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);

  let national;
  if (digits.startsWith("92") && digits.length === 12) national = digits.slice(2);
  else if (digits.startsWith("0") && digits.length === 11) national = digits.slice(1);
  else if (digits.length === 10) national = digits;
  else return null;

  if (!/^3\d{9}$/.test(national)) return null;
  return `+92${national}`;
}

/** "+923001234567" -> "0300 1234567" for display. */
export function formatPkPhone(e164) {
  const n = normalizePkPhone(e164);
  if (!n) return e164 ? String(e164) : "";
  const national = "0" + n.slice(3);
  return `${national.slice(0, 4)} ${national.slice(4)}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(input) {
  if (typeof input !== "string") return null;
  const e = input.trim().toLowerCase();
  return EMAIL_RE.test(e) ? e : null;
}

/** Login field: "Email or phone". Returns { email } | { phone } | null. */
export function parseIdentifier(input) {
  if (typeof input !== "string") return null;
  const value = input.trim();
  if (!value) return null;
  if (value.includes("@")) {
    const email = normalizeEmail(value);
    return email ? { email } : null;
  }
  const phone = normalizePkPhone(value);
  return phone ? { phone } : null;
}

/**
 * Values a phone may be stored as in old documents (the schema used to be Number,
 * so 03001234567 was saved as 3001234567). Used with the raw driver.
 */
export function phoneLookupVariants(e164) {
  const n = normalizePkPhone(e164);
  if (!n) return [];
  const national = n.slice(3);
  return [n, Number(national), Number("92" + national), "0" + national];
}
