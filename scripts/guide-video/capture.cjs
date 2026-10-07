// Step 1 of the Urdu guide videos: one highlighted phone screenshot per step.
//
//   npm run dev                                                        (app on localhost:3000)
//   node --env-file=.env scripts/seed-demo.mjs --apply                 (demo data; re-seed before each org run)
//   node --env-file=.env scripts/guide-video/capture.cjs mem           (member screens first: they change nothing)
//   node --env-file=.env scripts/guide-video/capture.cjs org           (organizer: approves, marks cash, gives payout)
//   node scripts/guide-video/build.cjs mem|org                         (step 2)
//
// Output: guide-videos/work/shots/<id>.png (gitignored).
// The ZZTEST prefix and localhost links are hidden in the screenshots only; the data is not changed.

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { MongoClient } = require("mongodb");

const BASE = "http://localhost:3000";
const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "guide-videos", "work", "shots");
const PASSWORD = "Demo@12345"; // demo logins from scripts/seed-demo.mjs
const which = process.argv[2] === "org" ? "org" : "mem";

async function demoIds() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  try {
    const list = await client.db().collection("committees").find({ name: /^ZZTEST/ }, { projection: { name: 1 } }).toArray();
    if (list.length < 5) throw new Error("Demo BCs not found. Run scripts/seed-demo.mjs --apply first.");
    return Object.fromEntries(list.map((c) => [c.name, String(c._id)]));
  } finally {
    await client.close();
  }
}

// Hide test markers in the visible text (screenshot only).
async function clean(p, first) {
  await p.evaluate((first) => {
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) {
      const o = n.nodeValue;
      if (!o) continue;
      let t = o.replace(/http:\/\/localhost:3000/g, "https://committie-app.vercel.app");
      t = t.replace(/ZZTEST\s+/g, "").replace(/ZZTEST/g, first);
      if (/^Z[A-Z]$/.test(t.trim())) t = t.trim().slice(1); // avatar initials
      if (t !== o) n.nodeValue = t;
    }
  }, first);
}

// Union rect of [locator, closestSelector?] pairs.
async function rectOf(list) {
  let r = null;
  for (const [loc, up] of list) {
    const el = loc.first();
    await el.waitFor({ state: "visible", timeout: 15000 });
    const b = await el.evaluate((e, up) => {
      const x = (up ? e.closest(up) || e : e).getBoundingClientRect();
      return { l: x.left, t: x.top, r: x.right, b: x.bottom };
    }, up || null);
    r = r ? { l: Math.min(r.l, b.l), t: Math.min(r.t, b.t), r: Math.max(r.r, b.r), b: Math.max(r.b, b.b) } : b;
  }
  return r;
}

async function center(loc, up) {
  await loc.first().evaluate((e, up) => (up ? e.closest(up) || e : e).scrollIntoView({ block: "center" }), up || null);
  await new Promise((r) => setTimeout(r, 500));
}

// Orange frame around the target, rest of the screen dimmed.
async function spotlight(p, r) {
  await p.evaluate((r) => {
    document.getElementById("__spot")?.remove();
    if (!r) return;
    const pad = 6;
    const d = document.createElement("div");
    d.id = "__spot";
    Object.assign(d.style, {
      position: "fixed", left: r.l - pad + "px", top: r.t - pad + "px", width: r.r - r.l + pad * 2 + "px", height: r.b - r.t + pad * 2 + "px",
      border: "4px solid #F59E0B", borderRadius: "16px", boxShadow: "0 0 0 4000px rgba(15,23,42,0.45)", pointerEvents: "none", zIndex: 2147483647,
    });
    document.body.appendChild(d);
  }, r);
}

const sheet = (p) => p.locator("[role=dialog] .rounded-t-2xl").last();

async function login(p, phone) {
  await p.goto(BASE + "/login", { waitUntil: "networkidle" });
  await p.getByLabel(/phone/i).first().fill(phone);
  await p.getByLabel(/password/i).first().fill(PASSWORD);
  await p.locator("button[type=submit]").click();
  await p.waitForURL(/\/(admin|userDash)/, { timeout: 60000 });
  await p.waitForLoadState("networkidle");
  await p.waitForTimeout(1000);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const ids = await demoIds();
  const { ORG, MEM } = require("./steps.cjs")({ BASE, ids, center, sheet, login });
  const steps = which === "org" ? ORG : MEM;
  const first = which === "org" ? "Ali" : "Usman";
  const browser = await chromium.launch();
  // 360 x 553 at 3x = 1080 x 1659, the screenshot area of a 1080 x 1920 frame.
  const ctx = await browser.newContext({ viewport: { width: 360, height: 553 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  for (const s of steps) {
    if (s.title) continue;
    process.stdout.write(s.id + " ");
    const targets = await s.run(p);
    await p.waitForTimeout(900);
    await clean(p, first);
    await p.waitForTimeout(150);
    await spotlight(p, targets ? await rectOf(targets) : null);
    await p.screenshot({ path: path.join(OUT, s.id + ".png") });
    await spotlight(p, null);
    if (s.after) await s.after(p);
  }
  console.log("\nScreenshots in", OUT);
  await browser.close();
})().catch((e) => {
  console.error("\nFAILED:", e.message.split("\n")[0]);
  process.exit(1);
});
