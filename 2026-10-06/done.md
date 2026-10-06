# 2026-10-06 — Done

Branch: `revamp-2026-10` (not committed yet, waiting for the owner to review).

## 1. Security fixed (all 46 old API routes reviewed; now 39 routes, every one checks auth itself)
- **Real auth on every route** via `app/utils/auth.js`: `requireUser / requireAdmin / requireSuperAdmin / requireMember / requireCommitteeOwner`. Identity comes from the token + database, never from body/query ids.
- **Deleted the fake middleware** (it only checked that a header existed).
- **Deleted dangerous routes:**
  - `admin/manage` (anyone could make themselves super admin)
  - `system/wipe` and `admin/system/*` (full DB wipe)
  - `bulk-upload`, `system/cleanup`, `settings`
  - open `notification/[id]` and `mark-as-read`
  - `member/[id]` (trusted body ids)
  - `member/admin-members`, `my-committie`
  - `committee/join`, `committee/open`, `committee/[id]/details`
  - `announcement`
  - old login, signup and reset routes
- **Organizer self-approval removed:** signup is always `pending`.
- **No more password hashes or KYC leaks:**
  - `select:false` on password, resetToken and password links.
  - Field lists in `app/utils/fields.js` for every populate.
  - KYC data only goes to the owner, their organizer or the super admin.
- **Password links:** sha256-hashed, single use, with expiry (invite 7 days, reset 1 hour). NoSQL injection is blocked (string type checks). Login locks for 15 minutes after 10 wrong tries.
- **Files:**
  - Only jpeg/png/webp up to 1.5 MB, upload requires login.
  - Images are served only to allowed people, with `nosniff` and a sandbox CSP.
  - `SecureImage` fetches images with the token.
- **Money routes:**
  - Owner checks on payment approve/reject, cash, payout and ping.
  - Conditional updates make a double tap safe (start, next month, payout).
- **Super admin** is decided by the `isSuperAdmin` field from the database. All the "tulaib" name checks are gone.
- **Security headers (CSP, frame, HSTS, permissions)** now apply to every page, not just `/api`.
- **Secrets:** `.env` removed from git tracking and `.env.example` added. **The owner must still rotate the secrets** (see remaining.md).
- **Live database:** `autoIndex: false`, so the dev server never builds indexes on the live database.

## 2. Broken flows fixed
- **One client wrapper** (`app/utils/api.js`: `adminApi` / `memberApi` / `publicApi`) adds the right token everywhere and sends the user to login on 401. This fixed the 401s on payment, profile, inbox, payout, connect and add member.
- **Members can upload CNIC and bills** from their Profile (verification works again).
- **Members see the payout schedule**, their turn month and amount, and payout status.
- **Real BC lifecycle:** Start BC (random draw or manual order) → monthly payments → payout required → Next month → auto-finish on the last month. End early is in the More menu.
- **Rejected join requests** no longer break member saves (enum now includes `rejected` and `removed`).

## 3. New features (from the owner's request)
- **Login with phone OR email.** Phones are normalized to `+923…`, and old numeric phones still work.
- **Organizer adds a member** (name + phone, email optional) → **WhatsApp invite link** → the member sets a password. The member goes straight into the BC.
- **Organizer invite (referral) link** `/join/REF-XXXX` → simple signup → the person is linked to that organizer.
- **Public BC link** `/bc/[id]` to share an upcoming BC on WhatsApp → "Create account to join" or "Ask to join".
- **Organizer can make a new password link** for their own member (no SMS cost). Super admin can do the same for organizers.
- **Super admin "Organizers" screen:** approve or reject, add an organizer (with invite link), new password link.
- **Emails** go out only if the person has an email: request approved, BC started (with turn month), payout given, invite, password reset, organizer approved. Shared mailer, `MAIL_MODE=log` for development.

## 4. Complete UI/UX redesign
- **Rules for every agent:** `AGENTS.md` (product, security, code and UI rules) and `docs/DESIGN_SYSTEM.md` (principles, tokens, components, fixed words and status colors). `CLAUDE.md` now just imports `AGENTS.md`.
- **New UI kit `app/ui/`:** AppShell, Page, Section, Card, Button, Bi (EN+UR), Field/Select/TextArea, Money, StatusBadge, Progress, Sheet, Confirm, MoreMenu, Tabs, ListRow, Avatar, Loading, ShareBox, SecureImage, PhotoPicker (compresses photos), PublicLayout, Logo.
- **New tokens** in `globals.css` / `tailwind.config.ts`: calm light theme, no gradients or glass, 16px base, 44px tap targets.
- **Organizer:**
  - **Home:** big Create BC button, a To do strip, and Running now / Coming up / Finished.
  - **BC page:** a different view per stage, with rare actions under More.
  - **Create BC:** a short form with a live summary.
  - **Members:** add a member and send the invite on WhatsApp.
  - **Other screens:** Invite link, Find members, Verify identity, Profile, Organizers, Activity log, Messages, Alerts.
  - **Navigation:** bottom nav with a center **+ New BC** button.
- **Member:**
  - **Home:** a To do strip ("Pay Rs X for Dec"), My BCs, requests, new BCs from my organizers.
  - **BC page:** 2-step **Pay** sheet, turn order, organizer contact.
  - **Other screens:** Find BCs, Near me, Organizer profile, Profile (details, payout account, identity, documents, password), Messages, Alerts.
- **Public:** new landing page (no fake stats), Login, Register, Forgot password, Invite, short honest help pages, Contact, Privacy, Terms, 404.
- **Old URLs** redirect to the new pages (in `next.config.mjs`).
- **Removed about 60 dead files:** old components, Theme folder, translations, backup pages, the Redux-era code, and `test_flow.js` / `simulation_flow.js` (they wrote to a real admin account).

## 5. Tools and scripts
- `npm test` (vitest) runs 36 unit tests (phone, WhatsApp, tokens, BC rules).
- `.eslintrc.json`: `npm run lint` shows 0 errors.
- `scripts/migrate-2026-10.mjs`: dry run by default.
  - Dry run on live: 50 member phones and 7 organizer phones to normalize, 5 BCs to tag `rulesVersion 1`, indexes to create.
  - **Not applied yet.**
- `scripts/e2e-api.mjs`: full lifecycle and security test against a running server, **57/57 passed**.
- `scripts/cleanup-test-data.mjs`: removes ZZTEST data. Ran it after testing; the database is clean (0 test records left).

## 6. Verified
- `npm test` 36/36, `npm run lint` 0 errors, `npm run build` passes.
- E2E 57/57 on the live database with ZZTEST data, then cleaned up.
- **Checked in the browser at 375px (and desktop):**
  - Landing, login with phone.
  - Organizer home, Create BC, Add member (WhatsApp invite).
  - Running view: check receipt, mark cash, give payout, next month.
  - Member home To do, member BC page, Pay sheet, profile, alerts, members, invite.
