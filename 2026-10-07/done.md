# 2026-10-07 — Done

- **Live database reset (owner ran it).**
  - Full backup first: `scripts/backups/full-backup-before-reset-*.json` (gitignored).
  - Everything deleted except the super admin account.
  - `migrate-2026-10.mjs --apply` run on the clean database (indexes in place, including the rate-limit index).
- **Demo data:** new `scripts/seed-demo.mjs` adds a ZZTEST set:
  - 3 organizers, one of them waiting for approval.
  - 12 members.
  - 5 BCs: filling, full, running (month 2), finished, and one from a second organizer.
  - Demo logins are in the file header.
- **Urdu guide videos** (portrait 1080×1920 MP4 with a Urdu voiceover by Microsoft Uzma neural, made for WhatsApp), in `guide-videos/` (gitignored):
  - `CommittieApp-Organizer-Guide-Urdu.mp4`: 6 min 43 s, 28 screens.
  - `CommittieApp-Member-Guide-Urdu.mp4`: 3 min 22 s, 13 screens.
  - Each frame highlights the button being explained, with its Urdu name and its English on-screen label.
  - The ZZTEST prefix and the localhost link are hidden in the frames.
- **Tools installed on this computer:** `edge-tts` (via uv) and ffmpeg (via winget).
- **Video scripts saved** in `scripts/guide-video/` (steps, capture, build). Tested: member capture + both builds. Demo data re-seeded afterwards.
