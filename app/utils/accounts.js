import Admin from "../api/models/Admin";
import Member from "../api/models/Member";
import { phoneLookupVariants } from "./phone";
import { hashToken, isLinkValid } from "./tokens";

// Account lookups that understand old documents (phone stored as a Number).

const SECRET_FIELDS = "+password +loginFails +lockUntil";

/** Ids of docs whose phone matches any stored form of this number (raw driver: no casting). */
async function idsByPhone(Model, phone) {
  const variants = phoneLookupVariants(phone);
  if (!variants.length) return [];
  const docs = await Model.collection.find({ phone: { $in: variants } }, { projection: { _id: 1 } }).toArray();
  return docs.map((d) => d._id);
}

/** All Admin + Member accounts matching { email } or { phone }, with password selected. */
export async function findAccounts(identifier, { withSecrets = true } = {}) {
  const select = withSecrets ? SECRET_FIELDS : "";
  if (identifier?.email) {
    const [admins, members] = await Promise.all([
      Admin.find({ email: identifier.email }).select(select),
      Member.find({ email: identifier.email }).select(select),
    ]);
    return { admins, members };
  }
  if (identifier?.phone) {
    const [adminIds, memberIds] = await Promise.all([idsByPhone(Admin, identifier.phone), idsByPhone(Member, identifier.phone)]);
    const [admins, members] = await Promise.all([
      adminIds.length ? Admin.find({ _id: { $in: adminIds } }).select(select) : [],
      memberIds.length ? Member.find({ _id: { $in: memberIds } }).select(select) : [],
    ]);
    return { admins, members };
  }
  return { admins: [], members: [] };
}

/** Is this phone/email already used by another account of the same type? */
export async function isTaken(Model, { phone, email }, excludeId) {
  const exclude = excludeId ? String(excludeId) : null;
  if (phone) {
    const ids = await idsByPhone(Model, phone);
    if (ids.some((id) => String(id) !== exclude)) return "phone";
  }
  if (email) {
    const doc = await Model.findOne({ email }).select("_id");
    if (doc && String(doc._id) !== exclude) return "email";
  }
  return null;
}

/** Safe object to send to the browser after login. */
export function publicAccount(doc, role) {
  return {
    _id: String(doc._id),
    name: doc.name || "",
    phone: doc.phone ? String(doc.phone) : "",
    email: doc.email || "",
    role,
    isSuperAdmin: role === "admin" ? !!doc.isSuperAdmin : false,
    verificationStatus: doc.verificationStatus || "unverified",
    city: doc.city || "",
  };
}

/** Find the account that owns a password link token (invite or reset). */
export async function findByLinkToken(raw) {
  if (typeof raw !== "string" || raw.length < 20) return null;
  const hash = hashToken(raw);
  for (const [Model, role] of [[Member, "member"], [Admin, "admin"]]) {
    const doc = await Model.findOne({ "passwordLink.hash": hash }).select("+passwordLink.hash");
    if (doc && isLinkValid(doc, raw)) return { doc, role };
  }
  return null;
}
