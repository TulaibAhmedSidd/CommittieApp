# CLAUDE_PROGRESS.md

Running log of work I (Claude Code) do in this repo at the user's request. Every entry records:

- **Status** — `pending` · `in_progress` · `complete`
- **Why** — one line on what the user asked for
- **Files changed** — concrete paths touched (or "none — audit only" for read-only work)

Newest entries go at the top. When a task changes status, update the same entry instead of duplicating it.

---

## 2026-06-24 — Phase 4: Register + dashboards + guides

User requested: redesign user + organizer register on the new tokens, completely rebuild both dashboards, verify APIs work, and ship detailed guide pages for member + organizer.

### #16 — Redesign `/register` (member + organizer) · **complete**
- **Why:** old form was a single column on dark gradient with raw `slate-*`/`primary-500/10` everywhere, no bilingual cues, organizer + member fields treated identically with no expectations-setting.
- **Files changed:** `app/register/page.jsx`.
- **What's new:**
  - Two-column layout (story rail on left, form on right) that collapses cleanly on mobile.
  - Bilingual everything: section labels, field labels (EN + UR side-by-side), benefit list, success state.
  - **Role toggle** is the first decision — Member sign-up uses primary emerald button, Organizer uses gold `accent` button so the visual weight matches the gravity of each path.
  - **Story rail** changes per role: member gets discovery/proof/trust benefits; organizer gets verification/cycle/fee benefits + a warning callout that organizer profiles need Super Admin approval.
  - **4 logical sections** (Identity → Contact → Location → Security) with step numbers; previously was one flat blob.
  - **Pakistani-only city dropdown** (22 cities sorted).
  - **Location capture** is now opt-in with a clear "stays private" note; shows captured lat/lng inline.
  - **Referral code** from `?ref=` query param is surfaced as an accent banner so the user knows they'll be auto-linked.
  - **Success state** is a full card with bilingual headline, role-specific copy (member: "ab login karain", organizer: "Super Admin review pending"), and CTAs to login + go home + read the matching guide page.
  - Zero raw palette colors — only tokens + new primitives.
- **API contract:** unchanged — still `POST /api/member` for members, `POST /api/admin` for organizers, with `{name, email, password, phone, city, county, location, referralCode?}`.

### #17 — Rewrite user dashboard (`/userDash/page.tsx`) · **complete**
- **Why:** old dashboard rendered the legacy `MainPage` component which fetched everything client-side, had raw slate styling, no bilingual cues, and embedded chat + notifications + association requests in one giant tree.
- **Files changed:** `app/userDash/page.tsx`.
- **What's new:**
  - Self-contained page (`MainPage` is no longer imported here; the legacy file stays in the repo for now in case any other route imports it).
  - **Greeting card** with Assalam-o-Alaikum time-aware salutation, jaali corner decoration, city + verification pill.
  - **Identity card** with avatar initial + email + Profile/Inbox quick actions.
  - **Verification CTA card** (warning tone) only renders if `verificationStatus !== "verified"`, with different copy for "pending" vs "unverified" and a CTA to `/userDash/profile`.
  - **4 Stat tiles** with Urdu labels: my committees, due-this-month (`<Money />`), verification status, open committees nearby.
  - **`dueThisMonth` is calculated client-side** from the committee `payments[]` array (filters `status: unpaid|rejected` for current month, sums `monthlyAmount`).
  - **Quick actions grid** (4 tiles): Explore / Near me / Messages / How it works (links to `/guide/member`).
  - **"My committees"** uses `MemberCommitteeCard` (file-local) with `<CycleProgress />`, payment-status pill for the current month, Money tile, and a contextual Pay button that disappears when the month is already verified.
  - **Pending requests** section only renders when there are pending join requests.
  - **Discover** section showing 4 open committees with `<Money />` + `<CycleProgress />` + bilingual "View details" CTA.
- **APIs used:** `GET /api/member/[id]` (with Bearer), `POST /api/member/my-committie` (returns `{approvedCommittees, pendingCommittees}`), `GET /api/committee?limit=6`. See API audit below for security caveats.

### #18 — Rewrite admin dashboard (`/admin/page.jsx`) · **complete**
- **Why:** old admin page used a hard `bg-slate-950 text-white` accent card and raw `bg-blue-500/5`/`bg-indigo-500/5`/`bg-amber-500/5` tile backgrounds — all of which are unthemed and won't respond to palette switching. Also missed an opportunity to surface pending approvals as a hero action.
- **Files changed:** `app/admin/page.jsx`.
- **What's new:**
  - **Greeting card** mirrors the member dashboard: time-aware salutation, jaali decoration, role pill (Organizer vs Super Admin), verification pill, system status pill.
  - **"Total pooled across your committees"** money figure pulled live from the committees list, with a primary CTA to create a new committee right there in the greeting.
  - **4 Stat tiles** with Urdu labels: active committees, total members, pending approvals, total pooled (`<Money />`). The "pending approvals" tile flips to warning tone if > 0.
  - **Pending approvals callout** (only when > 0) — bilingual hero CTA pushing organizer to review requests.
  - **Quick actions** grid is **role-aware**: super admins see Approvals / Verify identities / Audit logs / Global member pool; regular organizers see Add members / Referral center / Profile / Organizer guide.
  - **Active pools grid** uses `AdminCommitteeCard` (file-local) with `<CycleProgress />`, member-count / max-member ratio, monthly + total-pool Money tiles, pending-request callout per card, and Manage / Edit buttons.
  - **"New to the organizer console?"** accent card at the bottom links to `/guide/organizer`.
  - Zero raw palette colors anywhere in the file.
- **APIs used:** `GET /api/admin/stats?adminId=X` (Bearer required) and `GET /api/committee?adminId=X&limit=6` (Bearer required).

### #19 — API contract audit for new surfaces · **complete**
- **Files changed:** none — audit only.
- **Verified working with the new surfaces:**
  - `POST /api/member` — accepts `{name, email, password, phone, city, county, location, referralCode}`. Auto-approves status = `"approved"`. Sends reset-password email to the user. Stores `referredBy` if referralCode resolves to an Admin's `referralCode`.
  - `POST /api/admin` — accepts `{name, email, password, phone, city, county, location, createdBy?}`. Default status = `"pending"` (becomes `"approved"` only if `createdBy` is set, i.e. super admin manually created it).
  - `POST /api/login` → `{token, member}`. Rejects with 403 if member is pending.
  - `POST /api/admin/login` → `{token, data}` (note: `data` not `admin`, mild inconsistency). Rejects with 403 if admin is pending. Token claims include `isAdmin` and `isSuperAdmin`.
  - `GET /api/admin/stats?adminId=X` — Bearer required, returns `{activeCommittees, totalMembers, pendingApprovals, systemStatus}`. Non-super admin scoped to own committees + own member organizers.
  - `GET /api/committee[?adminId&q&page&limit]` — public listing without `adminId`; auth-required and scoped if `adminId` is provided.
- **Issues flagged (pre-existing, not introduced by Phase 4):**
  - **🚨 `POST /api/member/my-committie` has no auth check** — accepts any `userId` from body and returns that user's full committees including payments/payouts. The new user dashboard uses it for now (matches what `MainPage` already did) but this should be secured to `verifyMember(req)` + force `userId = auth.user.userId`. Same finding is in `AUDIT_REPORT.md` Section P0.
  - **`POST /api/admin` ignores `referralCode`** — organizer referral linkage isn't supported. Members get `referredBy`/`organizers[]` from a referralCode lookup; organizers don't. The new register copy doesn't promise organizer referral, so this is fine for now but worth noting if you add organizer→organizer referrals later.
  - **`/api/admin` requires phone, but `/admin/add-admin` (super admin manually creates organizer) only sends `{name, email, password}`** — that endpoint would 400. Pre-existing bug — likely needs a separate `/api/admin/internal-create` route or the form needs to collect the rest of the fields.
  - **`POST /api/member` hardcodes the reset URL to `https://committie-app.vercel.app/reset-password?token=...`** — if you launch a staging environment, those email links will point to prod. Move to `process.env.PUBLIC_APP_URL`.
  - **`/api/admin/login` returns `data` not `admin`** — naming inconsistency vs `/api/login` returning `member`. Cosmetic but the dashboards already accommodate both shapes.
  - **`/api/member` POST password reset email** is sent every sign-up (with a freshly generated random token) — this is the documented onboarding flow per the codebase, not a bug, but means new members can either use the email link OR their chosen password. Worth confirming if that's still intended.

### #20 — Build `/guide/member` and `/guide/organizer` · **complete**
- **Why:** the user asked for detailed walkthroughs explaining every option so members and organizers can self-onboard without a phone call.
- **Files changed:** `app/guide/member/page.jsx` (new), `app/guide/organizer/page.jsx` (new).
- **Shared shape (both guides):**
  - Hero with bilingual headline, lead paragraph, dual CTA (start sign-up / read the other guide).
  - **Sticky sidebar TOC** on desktop with every section listed bilingually; collapses inline on mobile.
  - Sections numbered `01`, `02`… with English + Urdu headings, a one-line lead, then rich content.
  - Three reusable section helpers (file-local): `Section`, `FieldExplainer` (label/urdu/body table), `Callout` (info/success/warning/danger tones).
  - Final CTA card with a "ready to start?" prompt and primary/secondary buttons.
- **Member guide sections:** Registration · Verification · Exploring · Joining · Monthly payments (with the "100% must pay before month advances" warning) · Receiving payout · Messaging · Profile & settings.
- **Organizer guide sections:** Registration & approval · Identity verification · **Create a committee** (every single field explained: name, description, monthlyAmount, monthDuration, maxMembers, organizerFee, isFeeMandatory, bankDetails, requireDocuments, mandatoryDocuments, start/end dates) · Member management (join requests + assign-member + bulk CSV) · Verifying payments · **Advancing months** (100% verification rule) · Recording payouts · Announcements · Organizer fee · Referrals · Super admin powers.
- **Bilingual:** every section title + most callouts have Urdu echoes; field explainers have Urdu in the label column.
- **Links throughout** point to the actual routes (`/register?role=organizer`, `/admin/create`, `/admin/manage`, etc.) so users can jump straight from explanation to action.

---

## 2026-06-24 — Phase 3: Light-default + landing rebuild + theme bug fixes

User feedback after seeing the live app:
1. Black text on dark bg on the landing (screenshot at `c:\Users\Tulaib\Desktop\save.png`).
2. Theme switching from the guide page didn't propagate.
3. They're Pakistani — "Indian / lakh grouping" labeling was wrong.
4. Wanted light-default (dark only on explicit toggle).
5. Wanted the landing fully redesigned with new components/layout — not a recolor of the old one.

### #12 — Switch Tailwind to `darkMode: 'class'` · **complete**
- **Why:** the existing landing used `dark:bg-slate-950` etc. With default `darkMode: 'media'`, Windows OS-level dark mode forced the whole app dark even though my tokens default to cream. That's the actual reason the screenshot looks dark.
- **Files changed:** `tailwind.config.ts`.

### #13 — Rename "Indian" grouping → "lakh-style" · **complete**
- **Why:** lakh-crore is used in Pakistan; the country-prefix label was incorrect.
- **Files changed:**
  - `app/utils/format.ts` — `PKRGrouping` type is now `"western" | "lakh"`.
  - `app/Components/Theme/Money.jsx` — JSDoc updated.
  - `app/theme-guide/page.jsx` — preview tile label is "Lakh-style grouping".

### #14 — Fix theme switcher: clean both `<html>` + `<body>`; add Save/Reset · **complete**
- **Why:** `ThemeContext.applyTheme` writes the `theme-*` class to BOTH `<html>` and `<body>`. My local switcher only cleaned `<html>`, so the body's CSS variables remained stale and the page didn't repaint cleanly.
- **Files changed:** `app/theme-guide/page.jsx`.
- **Notes:**
  - New `setActiveThemeClass(themeId)` helper strips `theme-*` from both elements before adding the new one.
  - Added **Save default** button — calls `PATCH /api/settings` so the choice persists for everyone (the same endpoint `ThemeContext` reads on boot).
  - Added **Reset** button — sets activeTheme back to `"midnight"` (the "no class" default) and pushes to settings, so previously-saved purple/royal themes can be cleared from the DB without using the admin panel.
  - This is what fixes the user-reported "theme color doesn't change" — switching now actually sticks because both DOM nodes are in sync AND saved themes can be wiped.

### #15 — Rebuild `app/page.tsx` from scratch · **complete**
- **Why:** old landing was dark navy + purple-gradient hero with `bg-slate-900` mock dashboard cards, plus `bg-slate-900 text-white` role section. User said "I dont want same UI component and design which is already there, redesign please."
- **Files changed:** `app/page.tsx`.
- **What's new (no recolor — a different layout and voice):**
  - **Brand mark:** `BC` square (Pakistani BC nomenclature) instead of the activity icon, with Urdu subline `بھروسے کی بی سی` under the wordmark.
  - **Hero:** asymmetric split — left has bilingual eyebrow (`BC / بی سی · بھروسے سے چلنے والی`), big two-line headline `Ghar ka committee — phone par.` with an Urdu sub-headline, dual CTA (Start saving + Become an organizer using the new `accent` gold button), and a row of trust signals (CNIC, JazzCash/EasyPaisa, Pakistan-wide). Right side is a **live committee snapshot card** with real Pakistani names (Aliya Khan, Hassan Raza, Fatima Bilal, Bilal Ahmed), Karachi/Lahore/Islamabad/Rawalpindi cities, real `<Money />` figures, `<CycleProgress />`, and a "next payout" highlight.
  - **Trust strip:** 4 `<Stat />` tiles (active members, verified organizers, total pooled in PKR, payout success) — uses the new urduLabel prop.
  - **Why trust us:** "Aap kyun bharosa karein?" 3-pillar section — CNIC verified, proof-first payments (JazzCash / EasyPaisa / bank screenshot specifically called out), organizer reputation.
  - **How it works:** "Aik committee kese chalti hai?" 4-step horizontal stepper with Urdu subtitle on each step and an accent callout for typical join → first payout time.
  - **Live pools:** 3 sample committees (`Gulshan Mothers' Circle`, `DHA Lahore Saver Pool`, `F-7 Islamabad Trust`) using the new primitives end-to-end. Each card shows `<Money />` + `<CycleProgress />` + bilingual "Request to join" button.
  - **Voices:** 3 Roman-Urdu testimonials with city tags.
  - **Organizer CTA:** light cream block with `jaali-border` decoration, gold accent corner, organizer pricing card (Free forever) using `<Money />` and a feature checklist.
  - **FAQ:** accordion (open by default on first item) with realistic Pakistani questions.
  - **Final CTA + footer:** `Apni committee, apne haath mein.` with Urdu echo + `Made in Pakistan / پاکستان میں بنا`.
  - **Zero raw `slate-*`/`blue-*`/`indigo-*`/`purple-*`** in the file — only token utilities (`bg-surface-50`, `border-border-100`, `text-ink-900`, `bg-primary-500/10`, `bg-accent-500/10`, etc.) and the new primitives.
  - **Light by default; dark mode only activates if the user explicitly toggles `.dark`** (thanks to #12).

> If the live site still looks purple after these changes, the DB-saved theme in `Settings.activeTheme` is set to a non-default value. Open `/theme-guide` and click **Reset** to clear it.

---

## 2026-06-24 — Phase 2: Style-guide preview

### #11 — Build `/theme-guide` style-guide page · **complete**
- **Why:** user wants to eyeball the emerald + gold direction before committing to the 86-file consumer sweep.
- **Files changed:** `app/theme-guide/page.jsx` (new).
- **What's on the page:**
  - Live theme switcher (default emerald, plus the nine alternate themes) and a light/dark toggle. Each tap flips `document.documentElement` classes so you can see every primitive re-paint in real time.
  - Full color ramps for `primary` / `accent` / `surface` / `ink` / `border` / `success` / `warning` / `danger` / `info` rendered as labeled swatches.
  - Typography demo with the hero headline `Apni committee, apne haath mein` and bilingual labels (inline + stack layouts).
  - `<Money />` examples: western grouping, Indian/lakh grouping, with Urdu words (`پچاس ہزار روپے`).
  - Four `<Stat />` tiles (with `<Money />` as value, deltas, urdu labels, primary/accent/success/danger tones).
  - `<CycleProgress />` in all four states (`open`, `ongoing` with paid overlay, `paused`, `finished`).
  - Every `<Button />` variant × size, including loading + disabled + bilingual content.
  - Every `<StatusPill />` tone, `<StepProgress />`, `<Input />` (default + error), `<Table />` with `<BlueTick />` + `<Money />` cells, `<EmptyState />`, and a `<Modal />` trigger with a realistic payment-confirm body.
- **How to view:** `npm run dev`, then `http://localhost:3000/theme-guide`.

---

## 2026-06-24 — Phase 1: Foundation (emerald + gold + cream tokens)

User direction picked from preview:

- **Palette:** Trust-bank emerald (`#047857`) + antique gold (`#C9A227`) + cream (`#FBF7EE`) surface
- **Scope order:** Foundation first (tokens + primitives) — then consumer sweep, then visual desi flourishes
- **Urdu policy:** Bilingual side-by-side on key surfaces
- **Currency:** `₨ 50,000` with grouping (single `<Money />` primitive)

### #7 — Rewrite `globals.css` with semantic token ramps · **complete**
- **Why:** the existing CSS variables only defined a single `--primary` per theme; Tailwind palette utilities ignored them. Needed full 50→900 ramps for primary, accent, surface, ink, border, plus semantic success/warning/danger/info/muted, exposed as space-separated RGB triplets so `bg-primary-500/10` works.
- **Files changed:** `app/globals.css`.
- **Notes:**
  - Default light theme is now emerald-on-cream with a faint jaali (geometric lattice) body texture.
  - Dark mode reads as "night ledger" — deep ink with cream text.
  - Old `.theme-forest/.theme-solar/...` classes are kept but now actually move the whole `--primary-*` ramp; `.theme-solar` also swaps `--accent-*` to emerald for variety.
  - New utility classes: `.desi-divider`, `.jaali-border`, `.gold-divider`, `.rupee::before`.

### #8 — Rewire `tailwind.config.ts` to read CSS variables · **complete**
- **Why:** `primary` was hardcoded to indigo — theme switching couldn't reach any `bg-primary-*`/`text-primary-*` class. Same fix needed for the new semantic palettes.
- **Files changed:** `tailwind.config.ts`.
- **Notes:**
  - `primary`, `accent`, `surface`, `ink`, `border`, `success`, `warning`, `danger`, `info`, `muted` are all now `rgb(var(--xxx-NNN) / <alpha-value>)` references.
  - Legacy `secondary` slate palette kept hardcoded so the ~86 unswept consumer files don't break — will be retired in a follow-up sweep.
  - Added shadows: `shadow-card`, `shadow-floating`, `shadow-gold`, `shadow-glow` (last one reads the live primary variable, so themed buttons get themed glows).
  - Added `font-urdu` to `fontFamily`.

### #9 — Strip raw colors from `Theme/*` primitives · **complete**
- **Why:** even the design-system primitives leaked `slate-*`/`rose-*`/etc., so consumers couldn't trust them to reflect theme tokens.
- **Files changed:**
  - `app/Components/Theme/Button.jsx` — `primary` variant now uses `bg-primary-600` (was `bg-slate-950`); `accent` variant added; `danger` uses `bg-danger-600` with semantic shadow.
  - `app/Components/Theme/Card.jsx` — `bg-surface-50/88`, `border-border-100`, ink+muted text.
  - `app/Components/Theme/StatusPill.jsx` — tones now `success`/`warning`/`danger`/`info`/`accent`/`neutral`, all token-driven.
  - `app/Components/Theme/Input.jsx` — token-driven borders + error states.
  - `app/Components/Theme/Modal.jsx` — surface/ink/border-100 throughout.
  - `app/Components/Theme/EmptyState.jsx` — empty icon ring now primary-themed instead of slate.
  - `app/Components/Theme/SectionHeader.jsx` — ink/muted token text.
  - `app/Components/Theme/StepProgress.jsx` — border + primary tokens, divide-by-zero fix on `width`.
  - `app/Components/Theme/Table.jsx` — surface/border/ink throughout.
  - `app/Components/Theme/BlueTick.jsx` — switched from blue to primary so the badge follows the active theme.
  - `app/Components/Theme/UploadCapture.jsx` — large sweep: success/danger/primary semantic colors, surface/ink/border tokens, primary-glow camera button.

### #10 — Add `Money`, `BilingualLabel`, `Stat`, `CycleProgress` primitives · **complete**
- **Why:** these were rebuilt inline across dozens of pages; centralizing them is what makes the upcoming consumer sweep cheap.
- **Files changed:**
  - `app/utils/format.ts` (new) — `formatPKR(amount, "western"|"indian")` and `amountInUrduWords(amount)` helpers. Indian grouping (`15,00,000` lakh-style) is opt-in for receipt-style surfaces; default Western grouping otherwise.
  - `app/Components/Theme/Money.jsx` (new) — `<Money amount={50000} suffix="/ month" showUrduWords />`. ₨ glyph, tabular nums, `tone` prop (`default`/`primary`/`accent`/`success`/`danger`), size scale, optional Urdu words for trust-heavy amounts.
  - `app/Components/Theme/BilingualLabel.jsx` (new) — `<BilingualLabel en="Pay Now" ur="ابھی ادا کریں" layout="inline|stack" />`. Honors active language: emphasizes the matching one, dims the other; can hide the secondary with `bilingual={false}`.
  - `app/Components/Theme/Stat.jsx` (new) — dashboard tile with `label`, `value` (accepts `<Money />`), `hint`, `delta`, `icon`, `tone`, `urduLabel`. Hover reveals a gold underline. Replaces the dozens of `metric-tile` ad-hoc rebuilds.
  - `app/Components/Theme/CycleProgress.jsx` (new) — committee monthly bar: `Month X / Y`, status pill, gold accent stripe overlay for current-month paid fraction, Urdu "سائیکل" eyebrow.

### #5 — Wire Tailwind primary palette to CSS variables · **complete**
- **Why:** umbrella task — closed by #7 + #8 + #9 + #10. Theme switching now actually propagates to every `bg-primary-*` / `text-success-*` / `border-border-*` / etc. used anywhere in the codebase.

### #6 — Desi UI/UX revamp — define direction · **complete** (direction locked)
- **Why:** gating decision for the rest of the work.
- **Answers locked in:** emerald + gold + cream, foundation-first, bilingual side-by-side, ₨ grouping.

---

## 2026-06-24 — Bootstrap

### #1 — Read context docs · **complete**
- **Why:** ground the revamp in existing intent.
- **Files changed:** none — audit only.
- **Read:** `about.md`, `APP_FLOW.md`, `AUDIT_REPORT.md`, `IMPLEMENTATION_PROGRESS.md`, `newflow.md`, `Summery.md`.

### #2 — Audit color-token consistency · **complete**
- **Why:** the user wants a single color source before any revamp.
- **Files changed:** none — audit only.
- **Findings (baseline before Phase 1):**
  - Theming chain was broken at the source: `tailwind.config.ts` hardcoded the `primary` palette to indigo, while `globals.css` `--primary` vars only flipped one shade per theme — Tailwind never read them, so `bg-primary-500` stayed indigo regardless of active theme.
  - Raw palette usage: **1409** occurrences across **86 files** vs only **460** `primary-*` uses across **60 files**.
  - Even `Theme/Button.jsx` defined its `primary` variant as `bg-slate-950`. Semantic tokens (`success`, `danger`, etc.) didn't exist.
  - No PKR / Urdu helpers — currency was hand-formatted per page.

### #3 — Audit reusable-component adoption · **complete**
- **Why:** confirm the design system was actually being reused.
- **Files changed:** none — audit only.
- **Findings (baseline before Phase 1):**
  - 44 of 86 color-using files imported any `Theme/*` primitive. Most admin pages mixed primitives with one-off markup.
  - Dead-code duplicates fighting reuse: `pageBackup.tsx`, `manage/page copy.jsx`, `assign-member/pageOld.jsx`, `MembersListingOld.tsx`, two `Committie.jsx`, two `ReferralCenter`, two `Modal`, `MyCommittie` + `MyCommittie2`.
  - Missing primitives still rebuilt inline: stat tile, monthly cycle progress, money display, identity chip, skeleton, breadcrumb header. (`<Stat />` and `<CycleProgress />` and `<Money />` now exist — see #10.)
  - Spelling drift: "committee" vs "committie" appears in folder names, component names, and copy.

### #4 — Create `CLAUDE_PROGRESS.md` · **complete**
- **Why:** user asked for a persistent change-log file.
- **Files changed:** `CLAUDE_PROGRESS.md` (new).

---

## How to read / extend this log

- Bootstrap entries set the **baseline**; Phase 1 sits on top.
- When the user asks for a new change, I add a new dated heading and one entry per task with status + files.
- Tasks that span days stay `in_progress` and the entry gets updated in place; on completion the status flips to `complete` and the final file list is locked in.
- If a task is dropped or superseded, the entry stays but moves to `dropped` with a one-line reason.

## Suggested next phases (not yet started — awaiting user go)

- **Phase 2 — Theme primitive proof page.** Spin up a `/theme` style-guide page that renders every primitive (Button variants, Card, Stat, Money, CycleProgress, BilingualLabel, StatusPill tones, StepProgress) so the user can visually confirm the emerald+gold direction before any consumer sweep.
- **Phase 3 — Consumer sweep, high-traffic first.** Replace raw `slate-*`/`emerald-*`/`rose-*` in: `app/page.tsx`, `app/login/page.tsx`, `app/register/page.jsx`, `app/userDash/page.tsx`, `app/userDash/explore/page.jsx`, `app/userDash/committee/[id]/page.jsx`, `app/admin/page.jsx`, `app/admin/Committie.jsx`, `app/admin/manage/page.jsx`. Drop in `<Money />` / `<Stat />` / `<CycleProgress />` everywhere they fit.
- **Phase 4 — Marketing landing rebuild.** `app/page.tsx` + `app/Components/HowWorks.jsx` + `app/Components/MainPage.jsx` rebuilt with desi vocabulary, trust storytelling, jaali motif accents, real PKR examples.
- **Phase 5 — Cleanup.** Delete `pageBackup.tsx`, `page copy.jsx`, `pageOld.jsx`, `MembersListingOld.tsx`. Consolidate duplicate `Committie.jsx` / `ReferralCenter` / `Modal` / `MyCommittie*`.
- **Phase 6 — i18n completion.** Sweep hardcoded strings into `translations.ts`, fix Urdu UTF-8 issues, validate RTL screen by screen.
