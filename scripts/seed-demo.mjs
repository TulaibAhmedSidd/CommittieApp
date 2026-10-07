// Adds a small ZZTEST demo set so every screen has something to show.
// Everything is named ZZTEST..., so cleanup-test-data.mjs removes it.
//
//   node --env-file=.env scripts/seed-demo.mjs          -> dry run (prints the plan)
//   node --env-file=.env scripts/seed-demo.mjs --apply  -> writes
//
// Demo logins (phone + password). Test values only:
//   Organizer:          +923990000001 / Demo@12345
//   Organizer (2nd):    +923990000002 / Demo@12345
//   Pending organizer:  +923990000003 / Demo@12345  (waits for super admin approval)
//   Members:            +923990000101 ... +923990000112 / Demo@12345

import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";

const APPLY = process.argv.includes("--apply");
const PASSWORD = "Demo@12345";
const now = new Date();
const monthStart = (offset) => new Date(now.getFullYear(), now.getMonth() + offset, 1);
const phone = (n) => `+92399${String(n).padStart(7, "0")}`;

async function main() {
  const client = new MongoClient(process.env.MONGO_URI, { ignoreUndefined: true });
  await client.connect();
  const db = client.db();
  try {
    const existing = await db.collection("admins").countDocuments({ name: /^ZZTEST/ });
    if (existing) throw new Error("Demo data already exists. Run cleanup-test-data.mjs --apply first.");
    const hash = await bcrypt.hash(PASSWORD, 10);
    const base = { password: hash, country: "Pakistan", city: "Lahore", tokenVersion: 0, loginFails: 0, createdAt: now, updatedAt: now };

    const ali = { _id: new ObjectId(), ...base, name: "ZZTEST Ali Khan", phone: phone(1), email: "zztest.ali@example.com", isAdmin: true, isSuperAdmin: false, status: "approved", verificationStatus: "verified", referralScore: 0 };
    const sana = { _id: new ObjectId(), ...base, name: "ZZTEST Sana Malik", phone: phone(2), isAdmin: true, isSuperAdmin: false, status: "approved", verificationStatus: "unverified", referralScore: 0, city: "Karachi" };
    const pending = { _id: new ObjectId(), ...base, name: "ZZTEST Bilal Ahmed", phone: phone(3), isAdmin: true, isSuperAdmin: false, status: "pending", verificationStatus: "unverified", referralScore: 0 };
    const admins = [ali, sana, pending];

    const names = ["Ayesha", "Usman", "Fatima", "Hamza", "Zainab", "Imran", "Nadia", "Kamran", "Rabia", "Tariq", "Saima", "Faisal"];
    const members = names.map((n, i) => ({
      _id: new ObjectId(), ...base, name: `ZZTEST ${n}`, phone: phone(101 + i), status: "approved",
      verificationStatus: i < 4 ? "verified" : "unverified", committees: [], organizers: [], pendingOrganizers: [], following: [], documents: [],
      createdBy: i < 9 ? ali._id : sana._id, createdByAdminName: i < 9 ? ali.name : sana.name,
    }));
    const M = (i) => members[i];

    const bc = (o) => ({
      _id: new ObjectId(), description: "", organizerFee: 0, isFeeMandatory: false, requireDocuments: false, mandatoryDocuments: [],
      payments: [], payouts: [], result: [], pendingMembers: [], rulesVersion: 2, currentMonth: 1, createdAt: now, updatedAt: now,
      ...o, monthDuration: o.maxMembers, totalAmount: o.monthlyAmount * o.maxMembers,
      endDate: new Date(o.startDate.getFullYear(), o.startDate.getMonth() + o.maxMembers - 1, 1),
    });
    const paid = (month, m, extra = {}) => ({ _id: new ObjectId(), month, member: m._id, status: "verified", method: "online", reviewedBy: ali._id, reviewedAt: now, updatedAt: now, submission: { transactionId: `TX${month}${m.phone.slice(-3)}`, submittedAt: now }, ...extra });
    const payout = (month, m, amount, by = ali) => ({ _id: new ObjectId(), month, member: m._id, amount, method: "online", transactionId: `PO${month}`, paidAt: now, recordedBy: by._id });

    // 1. Coming up, still filling: 3 of 5 members + 1 join request.
    const family = bc({ name: "ZZTEST Family BC", maxMembers: 5, monthlyAmount: 10000, startDate: monthStart(1), createdBy: ali._id, status: "open",
      members: [M(0), M(1), M(2)].map((m) => m._id), pendingMembers: [M(9)._id] });
    // 2. Coming up, full: ready to start (draw or manual order).
    const office = bc({ name: "ZZTEST Office BC", maxMembers: 4, monthlyAmount: 5000, startDate: monthStart(1), createdBy: ali._id, status: "full",
      members: [M(3), M(4), M(5), M(6)].map((m) => m._id) });
    // 3. Running, month 2 of 5: month 1 done; month 2 has paid, receipt to check, and unpaid.
    const runOrder = [M(0), M(3), M(7), M(8), M(1)];
    const running = bc({ name: "ZZTEST Running BC", maxMembers: 5, monthlyAmount: 20000, startDate: monthStart(-1), createdBy: ali._id, status: "ongoing",
      currentMonth: 2, startedAt: monthStart(-1), payoutOrderMode: "random", announcementDate: monthStart(-1),
      members: runOrder.map((m) => m._id), result: runOrder.map((m, i) => ({ member: m._id, position: i + 1 })),
      payments: [
        ...runOrder.slice(1).map((m) => paid(1, m)),
        paid(2, M(0)), paid(2, M(7), { method: "cash", submission: undefined }),
        paid(2, M(8), { status: "pending", reviewedBy: undefined, reviewedAt: undefined, submission: { transactionId: "TX2-8812", description: "Sent by JazzCash", submittedAt: now } }),
      ],
      payouts: [payout(1, runOrder[0], 80000)] });
    // 4. Finished: 3 members, all 3 months done.
    const finOrder = [M(4), M(5), M(2)];
    const finished = bc({ name: "ZZTEST Finished BC", maxMembers: 3, monthlyAmount: 3000, startDate: monthStart(-4), createdBy: ali._id, status: "finished",
      currentMonth: 3, startedAt: monthStart(-4), finishedAt: monthStart(-1), payoutOrderMode: "manual",
      members: finOrder.map((m) => m._id), result: finOrder.map((m, i) => ({ member: m._id, position: i + 1 })),
      payments: [1, 2, 3].flatMap((mo) => finOrder.filter((_, i) => i !== mo - 1).map((m) => paid(mo, m))),
      payouts: [1, 2, 3].map((mo) => payout(mo, finOrder[mo - 1], 6000)) });
    // 5. Second organizer's BC: running, month 1, nobody has paid yet.
    const sOrder = [M(9), M(10), M(11)];
    const sanaBc = bc({ name: "ZZTEST Sana BC", maxMembers: 3, monthlyAmount: 15000, startDate: monthStart(0), createdBy: sana._id, status: "ongoing",
      startedAt: monthStart(0), payoutOrderMode: "random", announcementDate: monthStart(0),
      members: sOrder.map((m) => m._id), result: sOrder.map((m, i) => ({ member: m._id, position: i + 1 })) });
    const bcs = [family, office, running, finished, sanaBc];

    // Link members to BCs and organizers the same way committeeOps does.
    for (const c of bcs) {
      for (const id of c.members) {
        const m = members.find((x) => x._id.equals(id));
        m.committees.push({ _id: new ObjectId(), committee: c._id, status: "approved" });
        if (!m.organizers.some((o) => o.equals(c.createdBy))) m.organizers.push(c.createdBy);
      }
      for (const id of c.pendingMembers) {
        const m = members.find((x) => x._id.equals(id));
        m.committees.push({ _id: new ObjectId(), committee: c._id, status: "pending" });
      }
    }
    for (const m of members) if (!m.organizers.length) m.organizers.push(m.createdBy);
    M(9).following.push(ali._id);

    const notifications = [
      { recipient: ali._id, recipientModel: "Admin", sender: M(9)._id, senderModel: "Member", type: "join_request", message: `${M(9).name} asked to join ${family.name}.`, link: `/admin/bc/${family._id}`, isRead: false, createdAt: now },
      { recipient: ali._id, recipientModel: "Admin", sender: M(8)._id, senderModel: "Member", type: "payment", message: `${M(8).name} sent a receipt for ${running.name}.`, link: `/admin/bc/${running._id}`, isRead: false, createdAt: now },
      { recipient: M(1)._id, recipientModel: "Member", sender: ali._id, senderModel: "Admin", type: "info", message: `Please pay your share for ${running.name}.`, link: `/userDash/bc/${running._id}`, isRead: false, createdAt: now },
      { recipient: M(0)._id, recipientModel: "Member", sender: ali._id, senderModel: "Admin", type: "bc_started", message: `${running.name} has started. Your turn: Month 1.`, link: `/userDash/bc/${running._id}`, isRead: true, createdAt: monthStart(-1) },
    ];

    console.log(`${APPLY ? "Adding" : "Would add"}: ${admins.length} organizers, ${members.length} members, ${bcs.length} BCs, ${notifications.length} notifications`);
    for (const c of bcs) console.log(`  ${c.name.padEnd(22)} ${c.status.padEnd(9)} ${c.members.length}/${c.maxMembers} members, month ${c.currentMonth}`);
    if (!APPLY) return console.log("Dry run. Add --apply to write.");

    await db.collection("admins").insertMany(admins);
    await db.collection("members").insertMany(members);
    await db.collection("committees").insertMany(bcs);
    await db.collection("notifications").insertMany(notifications);
    console.log("Done.");
  } finally {
    await client.close();
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
