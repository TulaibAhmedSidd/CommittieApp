// End-to-end API test against a running dev server. Creates ZZTEST data only.
//   node --env-file=.env scripts/e2e-api.mjs http://localhost:3100
// Clean up afterwards: node --env-file=.env scripts/cleanup-test-data.mjs --apply

import { MongoClient, ObjectId } from "mongodb";

const BASE = process.argv[2] || "http://localhost:3100";
const rnd = () => String(Math.floor(1000 + Math.random() * 9000));
const PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
let pass = 0, failCount = 0;

function check(name, cond, extra = "") {
  if (cond) { pass++; console.log(`  PASS ${name}`); }
  else { failCount++; console.log(`  FAIL ${name} ${extra}`); }
}

async function call(method, path, { token, body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}

async function approveTestOrganizer(id) {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const r = await client.db().collection("admins").updateOne({ _id: new ObjectId(id), name: /^ZZTEST/ }, { $set: { status: "approved" } });
  await client.close();
  return r.modifiedCount === 1;
}

async function main() {
  const tag = rnd();
  const orgPhone = `0300000${tag.slice(0, 3)}1`.slice(0, 11);
  console.log(`Run ${tag} against ${BASE}`);

  console.log("\n# Security basics");
  check("unauthenticated committee list is 401", (await call("GET", "/api/committee")).status === 401);
  check("old open route /api/admin/manage is gone", (await call("GET", "/api/admin/manage")).status === 404);
  check("old /api/member/my-committie is gone", (await call("POST", "/api/member/my-committie", { body: { userId: "x" } })).status === 404);
  check("fake token rejected", (await call("GET", "/api/admin/profile", { token: "abc" })).status === 401);
  check("NoSQL injection in login rejected", (await call("POST", "/api/auth/login", { body: { identifier: { $ne: null }, password: { $ne: null } } })).status === 400);
  check("NoSQL injection in set-password rejected", (await call("POST", "/api/auth/set-password", { body: { token: { $ne: "x" }, password: "hacked1" } })).status === 400);

  console.log("\n# Organizer signup + approval");
  let r = await call("POST", "/api/auth/register", { body: { role: "organizer", name: `ZZTEST Org ${tag}`, phone: orgPhone, password: "test1234", createdBy: "000000000000000000000000" } });
  check("organizer signup is pending (createdBy ignored)", r.status === 201 && r.data?.pending, JSON.stringify(r.data));
  r = await call("POST", "/api/auth/login", { body: { identifier: orgPhone, password: "test1234" } });
  check("pending organizer cannot log in", r.status === 403);
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const orgDoc = await client.db().collection("admins").findOne({ name: `ZZTEST Org ${tag}` });
  await client.close();
  check("test organizer approved by fixture", await approveTestOrganizer(String(orgDoc._id)));
  r = await call("POST", "/api/auth/login", { body: { identifier: orgPhone.replace(/^0/, "+92"), password: "test1234" } });
  check("organizer logs in with phone (+92 form)", r.status === 200 && r.data?.token);
  const org = r.data.token;
  check("login response has no password", !JSON.stringify(r.data).includes("password"));

  console.log("\n# Create BC");
  r = await call("POST", "/api/committee", { token: org, body: { name: `ZZTEST BC ${tag}`, maxMembers: 3, monthlyAmount: 1000, startDate: "2026-11" } });
  check("BC created", r.status === 201, JSON.stringify(r.data));
  const bcId = r.data.committee._id;
  r = await call("GET", `/api/committee/${bcId}`, { token: org });
  check("new BC: months = members", r.data?.committee?.monthDuration === 3 && r.data.committee.stage === "upcoming");
  check("pot = monthly x (members-1)", r.data?.committee?.pot === 2000, r.data?.committee?.pot);

  console.log("\n# Add member A (invite link)");
  r = await call("POST", "/api/admin/members", { token: org, body: { name: `ZZTEST Ali ${tag}`, phone: `0300001${tag}`.slice(0, 11), committeeId: bcId } });
  check("member A added with invite", r.status === 201 && r.data?.invite?.link, JSON.stringify(r.data));
  check("WhatsApp link generated", r.data?.invite?.waLink?.startsWith("https://wa.me/92"));
  const tokenA = r.data.invite.link.split("/invite/")[1];
  r = await call("GET", `/api/auth/password-link/${tokenA}`);
  check("invite link readable", r.status === 200 && r.data.purpose === "invite");
  r = await call("POST", "/api/auth/set-password", { body: { token: tokenA, password: "alipass1" } });
  check("A sets password and is logged in", r.status === 200 && r.data.token);
  const ali = r.data.token;
  const aliId = r.data.account._id;
  r = await call("POST", "/api/auth/set-password", { body: { token: tokenA, password: "again12" } });
  check("invite link works only once", r.status === 400);

  console.log("\n# Member B via referral link + join request");
  r = await call("GET", "/api/admin/referral", { token: org });
  check("referral link", r.status === 200 && r.data.link.includes("/join/REF-"));
  const ref = r.data.referralCode;
  const emailB = `zztest+${tag}@example.com`;
  r = await call("POST", "/api/auth/register", { body: { role: "member", name: `ZZTEST Bilal ${tag}`, phone: `0300002${tag}`.slice(0, 11), email: emailB, password: "bilal123", referralCode: ref } });
  check("B registers (instant login)", r.status === 201 && r.data.token, JSON.stringify(r.data));
  const bilal = r.data.token;
  const bilalId = r.data.account._id;
  r = await call("POST", "/api/auth/login", { body: { identifier: emailB.toUpperCase(), password: "bilal123" } });
  check("B logs in with email (any case)", r.status === 200);
  r = await call("POST", `/api/committee/${bcId}/request`, { token: bilal, body: {} });
  check("B asks to join", r.status === 201, JSON.stringify(r.data));
  r = await call("POST", `/api/committee/${bcId}/request`, { token: bilal, body: { action: "approve", memberId: bilalId } });
  check("member cannot approve own request", r.status === 403);
  r = await call("GET", `/api/committee`, { token: bilal });
  check("member cannot list organizer BCs", r.status === 403);
  r = await call("POST", `/api/committee/${bcId}/request`, { token: org, body: { action: "approve", memberId: bilalId } });
  check("organizer approves B", r.status === 200, JSON.stringify(r.data));

  console.log("\n# Member C (added, then joins via link)");
  r = await call("POST", "/api/admin/members", { token: org, body: { name: `ZZTEST Chand ${tag}`, phone: `0300003${tag}`.slice(0, 11), committeeId: bcId } });
  check("member C added", r.status === 201);
  const tokenC = r.data.invite.link.split("/invite/")[1];
  const cid = r.data.member._id;
  r = await call("POST", "/api/auth/set-password", { body: { token: tokenC, password: "chand123" } });
  const chand = r.data.token;

  r = await call("GET", `/api/committee/${bcId}`, { token: bilal });
  const peerJson = JSON.stringify(r.data);
  check("member view hides others' phones", !peerJson.includes("+92300001") && !peerJson.includes("payoutDetails"));
  r = await call("GET", `/api/public/bc/${bcId}`);
  check("public BC page works while upcoming", r.status === 200 && r.data.committee.membersCount === 3);

  console.log("\n# Start BC (manual order A, B, C)");
  r = await call("POST", `/api/committee/${bcId}/start`, { token: org, body: { mode: "manual", order: [aliId, bilalId, cid] } });
  check("BC started", r.status === 200, JSON.stringify(r.data));
  r = await call("POST", `/api/committee/${bcId}/start`, { token: org, body: { mode: "random" } });
  check("cannot start twice", r.status === 400 || r.status === 409);
  r = await call("GET", `/api/public/bc/${bcId}`);
  check("public page closed after start (410)", r.status === 410);

  console.log("\n# Month 1: receiver A");
  r = await call("POST", `/api/committee/${bcId}/payment`, { token: ali, body: { month: 1, screenshot: PNG } });
  check("receiver A cannot pay own month", r.status === 400);
  r = await call("POST", `/api/committee/${bcId}/payment`, { token: bilal, body: { month: 1, screenshot: "data:text/html;base64,PHNjcmlwdD4=" } });
  check("HTML upload refused", r.status === 400);
  r = await call("POST", `/api/committee/${bcId}/payment`, { token: bilal, body: { month: 1, screenshot: PNG, transactionId: "TX1" } });
  check("B sends receipt", r.status === 200, JSON.stringify(r.data));
  const receiptUrl = r.data.screenshot;
  check("receipt image hidden from anonymous", (await call("GET", receiptUrl)).status === 401);
  check("receipt image hidden from other member", (await call("GET", receiptUrl, { token: chand })).status === 403);
  check("receipt image visible to organizer", (await fetch(BASE + receiptUrl, { headers: { Authorization: `Bearer ${org}` } })).status === 200);
  r = await call("PATCH", `/api/committee/${bcId}/status`, { token: org, body: { action: "advance_month" } });
  check("cannot advance with unpaid members", r.status === 400);
  r = await call("PATCH", `/api/committee/${bcId}/payment`, { token: org, body: { action: "approve", memberId: bilalId } });
  check("organizer approves B's receipt", r.status === 200);
  r = await call("PATCH", `/api/committee/${bcId}/payment`, { token: org, body: { action: "mark_cash", memberId: cid } });
  check("organizer marks C paid in cash", r.status === 200);
  r = await call("PATCH", `/api/committee/${bcId}/status`, { token: org, body: { action: "advance_month" } });
  check("cannot advance before payout", r.status === 400 && /payout/i.test(r.data?.error || ""));
  r = await call("POST", `/api/committee/${bcId}/payout`, { token: org, body: { method: "cash" } });
  check("payout recorded", r.status === 200, JSON.stringify(r.data));
  r = await call("POST", `/api/committee/${bcId}/payout`, { token: org, body: { method: "cash" } });
  check("second payout same month refused", r.status === 409);
  const [a1, a2] = await Promise.all([
    call("PATCH", `/api/committee/${bcId}/status`, { token: org, body: { action: "advance_month" } }),
    call("PATCH", `/api/committee/${bcId}/status`, { token: org, body: { action: "advance_month" } }),
  ]);
  const codes = [a1.status, a2.status].sort();
  check("double tap on Next month only moves once", codes[0] === 200 && codes[1] !== 200, codes.join(","));

  console.log("\n# Months 2 and 3");
  for (const [month, payers] of [[2, [aliId, cid]], [3, [aliId, bilalId]]]) {
    for (const id of payers) await call("PATCH", `/api/committee/${bcId}/payment`, { token: org, body: { action: "mark_cash", memberId: id } });
    await call("POST", `/api/committee/${bcId}/payout`, { token: org, body: { method: "cash" } });
    r = await call("PATCH", `/api/committee/${bcId}/status`, { token: org, body: { action: "advance_month" } });
    check(`month ${month} closed`, r.status === 200, JSON.stringify(r.data));
  }
  check("last month finishes the BC", r.data?.finished === true);
  r = await call("GET", `/api/committee/${bcId}`, { token: org });
  check("BC finished with 3 payouts", r.data.committee.stage === "finished" && r.data.committee.payouts.length === 3);

  console.log("\n# After finish");
  const orgId = orgDoc._id.toString();
  r = await call("POST", "/api/review", { token: bilal, body: { organizerId: orgId, rating: 5, comment: "Very good" } });
  check("member can review organizer", r.status === 201, JSON.stringify(r.data));
  r = await call("GET", `/api/review?organizerId=${orgId}`);
  check("reviews public, first name only", r.status === 200 && r.data.reviews[0]?.memberName === "ZZTEST");
  r = await call("GET", "/api/member/bcs", { token: ali });
  check("member home lists the BC", r.status === 200 && r.data.mine.some((c) => c._id === bcId));
  r = await call("GET", "/api/discovery?type=member", { token: bilal });
  check("members cannot browse other members", r.status === 200 && r.data.items.length === 0);
  r = await call("GET", "/api/notification", { token: ali });
  check("A has notifications", r.status === 200 && r.data.items.length > 0);
  r = await call("POST", "/api/auth/forgot", { body: { identifier: emailB } });
  check("forgot password (email) answers", r.status === 200);
  r = await call("GET", "/api/logs", { token: org });
  check("non-super organizer cannot read logs", r.status === 403);
  r = await call("GET", "/api/admin/organizers", { token: org });
  check("non-super organizer cannot list organizers", r.status === 403);

  console.log(`\n${pass} passed, ${failCount} failed. BC id: ${bcId}`);
  process.exit(failCount ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
