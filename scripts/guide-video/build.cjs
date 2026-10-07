// Step 2 of the Urdu guide videos: frames + Urdu voice + MP4.
//
//   node scripts/guide-video/build.cjs mem|org [--tts]
//
// Needs: edge-tts (`uv tool install edge-tts`) and ffmpeg (`winget install Gyan.FFmpeg`).
// Set FFMPEG_DIR if ffmpeg/ffprobe are not on PATH. Voice clips are reused unless --tts is passed
// (pass it after changing any narration text in steps.cjs).
// Output: guide-videos/CommittieApp-<Organizer|Member>-Guide-Urdu.mp4 (1080x1920, H.264 + AAC).

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..", "..");
const WORK = path.join(ROOT, "guide-videos", "work");
const which = process.argv[2] === "org" ? "org" : "mem";
const VOICE = "ur-PK-UzmaNeural";

function tool(name) {
  if (process.env.FFMPEG_DIR) return path.join(process.env.FFMPEG_DIR, name);
  const winget = path.join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages");
  if (fs.existsSync(winget)) {
    const pkg = fs.readdirSync(winget).find((d) => d.startsWith("Gyan.FFmpeg"));
    if (pkg) {
      const build = fs.readdirSync(path.join(winget, pkg)).find((d) => d.startsWith("ffmpeg"));
      if (build) return path.join(winget, pkg, build, "bin", name);
    }
  }
  return name;
}
const FFMPEG = tool("ffmpeg.exe");
const FFPROBE = tool("ffprobe.exe");

const { ORG, MEM } = require("./steps.cjs")({});
const steps = which === "org" ? ORG : MEM;
const TITLE = which === "org" ? { ur: "منتظم کے لیے", en: "For organizers" } : { ur: "ممبرز کے لیے", en: "For members" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@500;700&family=Inter:wght@500;700;800&display=block');
*{margin:0;padding:0;box-sizing:border-box} body{width:1080px;height:1920px;background:#F4F4F1;font-family:Inter,sans-serif;overflow:hidden}
.ur{font-family:'Noto Nastaliq Urdu',serif;direction:rtl}
.head{height:261px;background:#0B6E4F;color:#fff;display:flex;align-items:center;gap:28px;padding:0 44px}
.num{flex:none;width:108px;height:108px;border-radius:54px;background:#F59E0B;color:#1F2937;font:800 52px Inter;display:flex;align-items:center;justify-content:center}
.txt{flex:1;display:flex;flex-direction:column;align-items:flex-end;gap:6px;min-width:0}
.cap{font-size:62px;line-height:1.9;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.en{font:700 34px Inter;background:rgba(255,255,255,.16);padding:8px 22px;border-radius:40px;max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;direction:ltr}
img{display:block;width:1080px;height:1659px}
.title{height:1920px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;background:linear-gradient(180deg,#0B6E4F,#07563D);color:#fff;text-align:center;padding:80px}
.logo{width:200px;height:200px;border-radius:48px;background:#fff;color:#0B6E4F;font:800 96px Inter;display:flex;align-items:center;justify-content:center}
.t1{font-size:96px;line-height:2;font-weight:700} .t2{font:700 52px Inter;opacity:.85}
.lines{margin-top:30px;display:flex;flex-direction:column;gap:18px;width:100%}
.line{background:rgba(255,255,255,.12);border-radius:28px;padding:10px 40px;font-size:54px;line-height:2;text-align:right}
`;

function frameHtml(s, n) {
  if (s.title) {
    if (s.lines) {
      const lines = s.lines.map((l) => `<div class="line ur">${esc(l)}</div>`).join("");
      return `<style>${CSS}</style><div class="title"><div class="t1 ur">${esc(s.cap)}</div><div class="lines">${lines}</div></div>`;
    }
    return `<style>${CSS}</style><div class="title"><div class="logo">BC</div><div class="t1 ur">${esc("کمیٹی ایپ · " + TITLE.ur)}</div><div class="t2">CommittieApp · ${TITLE.en}</div></div>`;
  }
  const shot = path.join(WORK, "shots", s.id + ".png");
  if (!fs.existsSync(shot)) throw new Error(`Missing ${shot}. Run capture.cjs ${which} first.`);
  const img = fs.readFileSync(shot).toString("base64");
  return `<style>${CSS}</style><div class="head"><div class="num">${n}</div><div class="txt"><div class="cap ur">${esc(s.cap)}</div><div class="en">${esc(s.en)}</div></div></div><img src="data:image/png;base64,${img}">`;
}

(async () => {
  for (const d of ["frames", "audio", "seg"]) fs.mkdirSync(path.join(WORK, d), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const list = [];
  let n = 0;
  for (const s of steps) {
    if (!s.title) n++;
    const frame = path.join(WORK, "frames", s.id + ".png");
    await page.setContent(frameHtml(s, n), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: frame });

    const mp3 = path.join(WORK, "audio", s.id + ".mp3");
    if (!fs.existsSync(mp3) || process.argv.includes("--tts")) {
      execFileSync("edge-tts", ["--voice", VOICE, "--rate=-12%", "--text", s.say, "--write-media", mp3]);
    }
    const dur = parseFloat(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp3]).toString());
    const total = (dur + (s.title ? 1.2 : 1.0)).toFixed(2);
    const seg = path.join(WORK, "seg", s.id + ".mp4");
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-loop", "1", "-framerate", "30", "-i", frame, "-i", mp3,
      "-filter_complex", "[1:a]adelay=400|400,apad[a];[0:v]scale=1080:1920,format=yuv420p,fade=t=in:st=0:d=0.25[v]",
      "-map", "[v]", "-map", "[a]", "-t", total, "-c:v", "libx264", "-preset", "medium", "-tune", "stillimage", "-crf", "20",
      "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-ac", "2", "-r", "30", seg]);
    list.push(`file '${seg.replace(/\\/g, "/")}'`);
    process.stdout.write(`${s.id}(${total}s) `);
  }
  await browser.close();

  const listFile = path.join(WORK, "seg", which + ".txt");
  fs.writeFileSync(listFile, list.join("\n"));
  const out = path.join(ROOT, "guide-videos", `CommittieApp-${which === "org" ? "Organizer" : "Member"}-Guide-Urdu.mp4`);
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", "-movflags", "+faststart", out]);
  console.log("\n" + out);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
