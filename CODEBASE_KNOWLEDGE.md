# CommittieApp — Codebase knowledge (updated 2026-10-06, after the revamp)

Rules: `AGENTS.md`. Design: `docs/DESIGN_SYSTEM.md`. Daily logs: `YYYY-MM-DD/`. This is a separate project from OfficeBite.

## What it is
A family "BC" (committee / ROSCA) app for Pakistan. Each month one member gets the pot; that receiver does not pay in their own month.
- **Stack:** Next.js 14.2 App Router (JS), React 18, Tailwind tokens, Mongoose 8 (MongoDB Atlas), JWT, bcryptjs, nodemailer (Gmail), next-pwa.
- **Live:** committie-app.vercel.app.

## Roles
| Role | Model | Session scope (localStorage) | Home |
|---|---|---|---|
| Member | `Member` | `member`: `token` + `member` | `/userDash` |
| Organizer | `Admin` | `admin`: `admin_token` + `admin_detail` | `/admin` |
| Super admin | `Admin` with `isSuperAdmin` (set in DB) | `admin` | `/admin` + Organizers, Activity log |

- **Login:** one `/login` page, "phone or email" + password, searches both models; if both match, the user chooses.
- **Tokens:** last 14 days and carry `tokenVersion` (bumped on password change or reset).
- **Signup:** organizers start `pending` (super admin approves); members are approved instantly.
- **Organizer-added members:** status `invited` until they set a password through `/invite/[token]`.

## Key files
- **Server helpers (`app/utils/`):**
  - `auth.js`: `require*` helpers and `signToken`.
  - `http.js`: `ok`, `fail`, `readJson`, `isObjectId`.
  - `fields.js`: safe select lists.
  - `accounts.js`: phone/email lookup, also for old numeric phones.
  - `tokens.js`: password links.
  - `bcRules.js`: **all BC logic**, pure and unit-tested.
  - `committeeView.js`: owner / member / public / card response shapes.
  - `committeeOps.js`: `addMemberToCommittee`.
  - `assets.js`: images.
  - `mailer.js` + `emailTemplates.js`, `notify.js`, `invites.js`, `inbox.js`, `memberDocs.js`, `phone.js`, `whatsapp.js`, `logger.js`, `db.js` (`autoIndex` off).
- **Client helpers (`app/utils/`):**
  - `api.js`: `adminApi`, `memberApi`, `publicApi`.
  - `session.js`, `useSession.js`, `useApi.js`.
  - `words.js`: the `W` words and the `STATUS` vocabulary.
- **UI kit:** `app/ui/*` (see the design system). Feature components live in `app/Components/`: BcCard, ChatBox, InboxList, NotificationList, `Auth/SetPasswordForm`, PWAinstall.

## Pages
- **Public:**
  - `/`, `/login`, `/register` (`?role=organizer`, `?ref=`, `?next=`), `/forgot-password`, `/reset-password?token=`, `/invite/[token]`, `/join/[code]` (redirects to register with `ref`).
  - `/bc/[id]`: public link for an upcoming BC.
  - `/guide/member`, `/guide/organizer`, `/contact`, `/privacy`, `/terms`.
- **Organizer:**
  - `/admin`: home.
  - `/admin/bcs`: tabs for the three stages.
  - `/admin/create`.
  - `/admin/bc/[id]`: views for Coming up, Running and Finished, plus a More menu (Edit, Turn order, Past months, End early, Delete).
  - `/admin/members`.
  - Under More: `/admin/invite`, `/admin/all-members` (Find members), `/admin/verify-identities`, `/admin/profile`, `/admin/inbox`, `/admin/notifications`.
  - Super admin only: `/admin/approvals` (Organizers), `/admin/logs`.
- **Member:**
  - `/userDash`: home.
  - `/userDash/bc/[id]`: Pay sheet, turn order, organizer, rating once finished.
  - `/userDash/explore`, `/userDash/near-me`, `/userDash/organizer/[id]`, `/userDash/profile`, `/userDash/inbox`, `/userDash/notifications`.
- **Old URLs** redirect (see `next.config.mjs` `redirects()`).

## API (39 routes)
| Area | Route | Guard |
|---|---|---|
| Auth | `POST /api/auth/login`, `register`, `forgot`, `set-password`; `GET /api/auth/password-link/[token]` | public |
| | `GET /api/auth/me` | user |
| BCs | `GET/POST/PATCH/DELETE /api/committee` | admin (owner for PATCH/DELETE; `?all=1` super) |
| | `GET /api/committee/[id]` | user; answer shaped by who asks |
| | `POST /[id]/request` | member join/cancel, or owner approve/reject |
| | `POST /[id]/start` | owner: `{ mode: random\|manual, order }` |
| | `PATCH /[id]/status` | owner: `advance_month`, `end_early` |
| | `POST /[id]/payment` | member sends receipt |
| | `PATCH /[id]/payment` | owner: approve / reject / mark_cash |
| | `POST /[id]/payout` | owner |
| | `POST /[id]/ping` | owner; returns waLink |
| | `POST/DELETE /[id]/members` | owner, before start |
| | `GET /api/public/bc/[id]` | public, upcoming only |
| Organizer | `GET/POST /api/admin/members`, `GET/PATCH/DELETE /api/admin/members/[id]`, `POST /api/admin/members/[id]/link` | admin, own members |
| | `GET/PATCH /api/admin/profile`, `GET /api/admin/referral`, `GET/PATCH /api/admin/verify`, `GET /api/admin/inbox` | admin |
| | `GET /api/admin/[id]/details` | public organizer profile (+ viewer flags) |
| | `GET/POST /api/admin/organizers`, `PATCH /api/admin/organizers/[id]`, `POST /api/admin/organizers/[id]/link`, `GET /api/logs` | super admin |
| Member | `GET /api/member/bcs` | member: mine, requests, comingUp |
| | `GET/PATCH /api/member/profile`, `GET /api/member/inbox`, `POST /api/member/respond-request` | member |
| | `POST /api/member/pool` | user: organizer asks a member to connect; member follows an organizer |
| Common | `GET/POST /api/messages`, `GET/PATCH /api/notification`, `POST /api/assets`, `GET /api/assets/[id]`, `GET /api/discovery` | user |
| | `GET /api/review` | public |
| | `POST /api/review` | member, after a finished BC |

## Data model notes
- **Committee:**
  - Status `open | full | ongoing | finished`, mapped to stage by `bcRules.stage()`.
  - `rulesVersion` is 2 for new BCs (months = members) and 1 for old ones.
  - `result[]` holds the turn order.
  - `payments[]` entries have `{ month, member, status, method, submission, reviewedBy, rejectReason }`.
  - `payouts[]` entries have `{ month, member, amount, method, recordedBy }`.
- **Member / Admin:**
  - `phone` is E.164 text; `email` is optional and lowercase.
  - `passwordLink { hash, purpose, expiresAt }`, `tokenVersion`, `loginFails`, `lockUntil`.
- **Asset:** base64 image, served only to allowed viewers.

## Scripts
- **Commands:** `npm run dev`, `npm run build`, `npm run lint`, `npm test`.
- **`scripts/migrate-2026-10.mjs`:** dry run by default; `--apply` writes. Normalizes phones and emails, tags old BCs, creates indexes. Applied to live on 2026-10-07 (after the live DB was reset).
- **`scripts/e2e-api.mjs <baseUrl>`:** full lifecycle and security test using ZZTEST data.
- **`scripts/cleanup-test-data.mjs`:** removes ZZTEST data (dry run by default).
- **`scripts/seed-demo.mjs`:** adds a ZZTEST demo set (3 organizers, 12 members, 5 BCs in every stage). Dry run by default; refuses if ZZTEST data already exists. Demo logins are in the file header.
- **`scripts/guide-video/`:** Urdu guide videos. `steps.cjs` = narration + which button to highlight; `capture.cjs mem|org` takes the screenshots (needs `npm run dev` and fresh demo data; `org` changes the demo Running BC); `build.cjs mem|org` makes the MP4 in `guide-videos/` (gitignored). Web copies (720p) are in `public/guides/` and shown by `app/Components/GuideVideo.jsx` on `/` (How it works) and on `/guide/organizer`, `/guide/member`. `public/guides` and `public/video` are excluded from the PWA precache. Needs edge-tts and ffmpeg.

## Warnings
- The dev `.env` points to the **live** database. Use `ZZTEST` names for test data, keep `MAIL_MODE=log` in `.env.local`, and clean up afterwards.
- The old secrets are in git history and **must be rotated before deploy** (see `2026-10-06/remaining.md`).
