// One-time data migration for the 2026-10 revamp. Safe to run many times.
//
//   node --env-file=.env scripts/migrate-2026-10.mjs            -> dry run (prints what would change)
//   node --env-file=.env scripts/migrate-2026-10.mjs --apply    -> writes (backup JSON saved first)
//   --only=phones,emails,committees,indexes                     -> run some steps only
//
// Never deletes documents. Never prints phone numbers or emails (ids and counts only).

import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

const APPLY = process.argv.includes("--apply");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.slice(7).split(",") : ["phones", "emails", "committees", "indexes"];

function normalizePkPhone(input) {
  if (input === null || input === undefined) return null;
  let d = String(input).replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  let n;
  if (d.startsWith("92") && d.length === 12) n = d.slice(2);
  else if (d.startsWith("0") && d.length === 11) n = d.slice(1);
  else if (d.length === 10) n = d;
  else return null;
  return /^3\d{9}$/.test(n) ? `+92${n}` : null;
}

const backup = [];
const log = (...a) => console.log(...a);

async function phones(db) {
  for (const name of ["members", "admins"]) {
    const col = db.collection(name);
    const docs = await col.find({ phone: { $exists: true, $ne: null } }, { projection: { phone: 1, phoneLegacy: 1 } }).toArray();
    let change = 0, bad = [];
    for (const d of docs) {
      if (typeof d.phone === "string" && /^\+923\d{9}$/.test(d.phone)) continue;
      const n = normalizePkPhone(d.phone);
      if (!n) { bad.push(String(d._id)); continue; }
      change++;
      if (APPLY) {
        backup.push({ col: name, _id: d._id, phone: d.phone });
        await col.updateOne({ _id: d._id }, { $set: { phone: n, ...(d.phoneLegacy === undefined ? { phoneLegacy: d.phone } : {}) } });
      }
    }
    log(`[phones] ${name}: ${change} to normalize, ${bad.length} unreadable${bad.length ? ` (ids: ${bad.slice(0, 20).join(", ")})` : ""}`);
  }
}

async function emails(db) {
  for (const name of ["members", "admins"]) {
    const col = db.collection(name);
    const docs = await col.find({ email: { $exists: true } }, { projection: { email: 1 } }).toArray();
    const seen = new Map();
    let change = 0, empty = 0, clash = 0;
    for (const d of docs) {
      if (typeof d.email !== "string") continue;
      const e = d.email.trim().toLowerCase();
      if (!e) {
        empty++;
        if (APPLY) { backup.push({ col: name, _id: d._id, email: d.email }); await col.updateOne({ _id: d._id }, { $unset: { email: 1 } }); }
        continue;
      }
      if (seen.has(e) && seen.get(e) !== String(d._id)) { clash++; continue; }
      seen.set(e, String(d._id));
      if (e !== d.email) {
        change++;
        if (APPLY) { backup.push({ col: name, _id: d._id, email: d.email }); await col.updateOne({ _id: d._id }, { $set: { email: e } }); }
      }
    }
    log(`[emails] ${name}: ${change} to lowercase, ${empty} empty to remove, ${clash} case-duplicates skipped`);
  }
}

async function duplicates(db) {
  const report = {};
  for (const [name, field] of [["members", "phone"], ["admins", "phone"], ["members", "email"], ["admins", "email"]]) {
    const dups = await db.collection(name).aggregate([
      { $match: { [field]: { $type: "string", $ne: "" } } },
      { $group: { _id: `$${field}`, ids: { $push: "$_id" }, n: { $sum: 1 } } },
      { $match: { n: { $gt: 1 } } },
    ]).toArray();
    report[`${name}.${field}`] = dups.length;
    if (dups.length) log(`[dupes] ${name}.${field}: ${dups.length} groups (ids: ${dups.slice(0, 5).map((d) => d.ids.join("/")).join(", ")})`);
  }
  return report;
}

async function committees(db) {
  const col = db.collection("committees");
  const drawn = await col.find({ status: "full", $or: [{ "result.0": { $exists: true } }, { "payments.0": { $exists: true } }] }, { projection: { _id: 1 } }).toArray();
  const noVersion = await col.countDocuments({ rulesVersion: { $exists: false } });
  log(`[committees] ${drawn.length} drawn 'full' BCs -> 'ongoing'; ${noVersion} without rulesVersion -> 1`);
  if (APPLY) {
    for (const d of drawn) {
      backup.push({ col: "committees", _id: d._id, status: "full" });
      await col.updateOne({ _id: d._id, status: "full" }, { $set: { status: "ongoing", statusMigratedFrom: "full" } });
    }
    await col.updateMany({ rulesVersion: { $exists: false } }, { $set: { rulesVersion: 1 } });
  }
}

async function indexes(db, dupes) {
  const plan = [
    ["members", { email: 1 }, {}],
    ["members", { organizers: 1 }, {}],
    ["committees", { createdBy: 1, status: 1 }, {}],
    ["committees", { members: 1 }, {}],
    ["committees", { pendingMembers: 1 }, {}],
    ["notifications", { recipient: 1, createdAt: -1 }, {}],
    ["members", { "passwordLink.hash": 1 }, { sparse: true }],
    ["admins", { "passwordLink.hash": 1 }, { sparse: true }],
  ];
  if (!dupes["members.phone"]) plan.push(["members", { phone: 1 }, { unique: true, partialFilterExpression: { phone: { $type: "string" } }, name: "phone_unique" }]);
  else log("[indexes] members.phone has duplicates: unique index skipped (app checks uniqueness)");
  if (!dupes["admins.phone"]) plan.push(["admins", { phone: 1 }, { unique: true, partialFilterExpression: { phone: { $type: "string" } }, name: "phone_unique" }]);
  else log("[indexes] admins.phone has duplicates: unique index skipped");

  const adminIdx = await db.collection("admins").indexes();
  const emailIdx = adminIdx.find((i) => i.name === "email_1");
  const needsEmailSwap = emailIdx && !emailIdx.partialFilterExpression;
  log(`[indexes] ${plan.length} to ensure${needsEmailSwap ? " + replace admins.email_1 with a partial unique index" : ""}`);
  if (!APPLY) return;
  if (needsEmailSwap && !dupes["admins.email"]) {
    await db.collection("admins").dropIndex("email_1");
    await db.collection("admins").createIndex({ email: 1 }, { unique: true, partialFilterExpression: { email: { $type: "string" } }, name: "email_1" });
  }
  for (const [col, keys, opts] of plan) await db.collection(col).createIndex(keys, opts);
}

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing. Run with --env-file=.env");
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();
  log(`Database: ${db.databaseName} | mode: ${APPLY ? "APPLY" : "DRY RUN"} | steps: ${ONLY.join(", ")}`);
  try {
    if (ONLY.includes("phones")) await phones(db);
    if (ONLY.includes("emails")) await emails(db);
    const dupes = await duplicates(db);
    if (ONLY.includes("committees")) await committees(db);
    if (ONLY.includes("indexes")) await indexes(db, dupes);
  } finally {
    if (APPLY && backup.length) {
      const dir = path.join(process.cwd(), "scripts", "backups");
      fs.mkdirSync(dir, { recursive: true });
      const file = path.join(dir, `migrate-2026-10-${Date.now()}.json`);
      fs.writeFileSync(file, JSON.stringify(backup, null, 2));
      log(`Backup of old values: ${file}`);
    }
    await client.close();
  }
  log(APPLY ? "Done." : "Dry run only. Add --apply to write.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
