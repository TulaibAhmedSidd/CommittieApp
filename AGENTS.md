# AGENTS.md — rules for every AI agent and developer

This file is the single source of rules for CommittieApp. It applies to Claude Code, Antigravity, Cursor, Copilot and humans.
Read it fully before changing anything. If a rule here conflicts with older docs in the repo, **this file wins**.

Companion docs:
- `docs/DESIGN_SYSTEM.md`: how screens look and read (components, words, layout). **Required for any UI work.**
- `CODEBASE_KNOWLEDGE.md`: map of pages, APIs and data. Update it when you add or remove a page or route.
- `YYYY-MM-DD/` folders: daily work log (`done.md`, `next.md`, `remaining.md`).

---

## 1. Who the app is for

CommittieApp runs "BC" / committee savings groups (ROSCA) in Pakistan. The first users are **one family's elders**: uncles and aunts who organize BCs. Many are not tech-savvy, read slowly, use Android phones and WhatsApp, and may not have email.

Every decision follows from this:
1. **Simple beats complete.** If a feature makes the main screen harder, hide it under "More" or remove it.
2. **The core loop must be obvious.** Create BC → add members (WhatsApp invite) → approve → start → monthly: pay, check, give payout, next month → finish.
3. **Phone first.** Design for a 360px-wide Android screen first. Desktop is a wider version of the same screens.
4. **Money must be correct and traceable.** Every money action is checked on the server and logged.

## 2. Product rules (business logic)

The logic lives in `app/utils/bcRules.js` (pure functions with unit tests). **Use these functions; never re-implement the rules in a page or route.**

- **Stages:** `upcoming` ("Coming up", status open/full, no order yet) → `running` ("Running now", status ongoing) → `finished`.
- **New BCs (`rulesVersion: 2`):** months = members. Old BCs (`rulesVersion: 1`) may have more months; the payout order wraps around.
- **Receiver:** each month one member gets the pot (from `committee.result`). **The receiver does not pay in their own month.**
- **Pot** = `monthlyAmount × (members − 1)`.
- **Start BC:** needs exactly `maxMembers` members. The organizer chooses a **random draw or a manual order**.
- **Next month** needs every payer `verified` **and** this month's payout recorded. "Paid in cash" is allowed for both.
- **Last month:** "Next month" becomes "Finish BC".
- **Members added by an organizer** go straight into the BC and get a notification. Members who ask to join wait for approval.
- **Organizer signup** needs super-admin approval. **Member signup** is instant.
- **Login** is by **email or phone** + password. Email is optional. Phones are stored as E.164 (`+923001234567`). Use `app/utils/phone.js`.
- **No SMS.** Invites and password links go by **WhatsApp link** (`app/utils/whatsapp.js`), and by email only when the person has one.

## 3. Security rules (never break these)

1. **Every API route checks auth itself** with the helpers in `app/utils/auth.js`. There is no middleware auth.
   - `requireUser`, `requireAdmin`, `requireSuperAdmin`, `requireMember`, `requireCommitteeOwner(req, id)`.
   - Pattern: `const auth = await requireAdmin(req); if (auth.error) return auth.error;`
2. **Identity comes from the token + database (`auth.user`)**, never from body or query ids (`adminId`, `memberId`, `userId`).
3. **Super admin** = `auth.user.isSuperAdmin` loaded from the DB. Never check names or emails.
4. **Never return secrets.** `password`, `resetToken`, `passwordLink`, `loginFails` and `lockUntil` have `select: false`. When you populate people, use the field lists in `app/utils/fields.js`. KYC fields (CNIC images, NIC number) go only to the owner, their linked organizer, or the super admin.
5. **No mass assignment.** Copy allowed fields one by one (see `pick()` in `app/utils/http.js`). Never `findByIdAndUpdate(id, req.body)`.
6. **Validate types.** Strings must be strings, ids must pass `isObjectId`, numbers must be in range. Never put user input into a query object without checking it (NoSQL injection).
7. **Images:** only jpeg/png/webp up to 1.5 MB, through `app/utils/assets.js`. Show them with `<SecureImage>` (it sends the token). Never use a raw `<img src="/api/assets/...">`.
8. **Money actions use conditional updates** (for example `updateOne({ _id, currentMonth: n }, ...)`), so a double tap can't apply twice.
9. **Log** every organizer or admin change with `createLog()` from `app/utils/logger.js`.
10. **Secrets live only in `.env`** (gitignored). Never commit `.env`. Add new variables to `.env.example`.
11. **Shared database warning:** the dev `.env` points at the **live** Atlas DB.
    - Test data must use names starting with `ZZTEST`; remove it with `scripts/cleanup-test-data.mjs`.
    - Never run bulk deletes or seeds.
    - Keep `MAIL_MODE=log` in `.env.local` while developing.

## 4. Code rules

- **API responses:** success returns the data object; failure returns `{ error: "Simple message" }` via `ok()` / `fail()` / `serverError()` from `app/utils/http.js`. Error messages are short, plain English that a user can act on.
- **Client calls** always go through `app/utils/api.js`: `adminApi` on organizer pages, `memberApi` on member pages, `publicApi` for public pages. **Never call `fetch` directly from a page.** The wrapper adds the token and handles expired logins.
- **Sessions** use `app/utils/session.js` and `useSession(scope)` from `app/utils/useSession.js`. Scopes are `admin` and `member`.
- **Route files (`route.js`) export only HTTP handlers** (`GET`, `POST`, ...) and `dynamic`. Put shared helpers in `app/utils/`.
- **One home per feature:**
  - BC rules: `bcRules.js`
  - BC response shapes: `committeeView.js`
  - Committee membership changes: `committeeOps.js`
  - Email: `mailer.js` + `emailTemplates.js`
  - Notifications: `notify.js`
  - Words: `words.js`
- **Domain spelling:** use "BC" in UI text. In code, models and routes keep `committee`. Don't introduce new spellings.
- **Keep files small.** A page over ~300 lines should be split into components in a local `_components/` folder.
- **Delete dead code**; don't leave `pageOld.jsx` or `copy` files.

## 5. UI rules (summary — the full detail is in `docs/DESIGN_SYSTEM.md`)

1. **Use only `app/ui/*` components** for buttons, cards, fields, badges, sheets and lists. Don't make a new button style inside a page.
2. **One main action per screen**, shown as the big primary button. Everything else goes in secondary buttons or under **More**.
3. **Home screens show at most 3 items per list**, with "See all".
4. **Words:** short, everyday English, with Urdu under the important labels via `<Bi en ur />` and `app/utils/words.js`.
   - **Forbidden:** jargon ("sync", "pool", "circuit", "ledger", "establish", "protocol", "node"), ALL CAPS, italics for decoration, and exclamation-heavy marketing copy.
5. **Status words and colors are fixed** (see the design system): green = done/paid, amber = needs action/waiting, red = problem, gray = not yet.
6. **Tap targets are at least 44px tall.** Base font 16px. No action may depend on hover.
7. **Every list has an empty state, a loading state and an error state.**
8. **Don't flip the whole layout for Urdu.** Urdu text gets `dir="rtl"` and `font-urdu` on its own span (`<Bi>` does this).
9. **Money:** always `<Money>`, e.g. "Rs 10,000". **Dates:** "Jan 2027" for BC months; "12 Jan" for events.
10. **Light theme only** for now. Use tokens (`bg-surface`, `text-ink-900`, `bg-primary-600`, ...), never raw Tailwind palette colors like `slate-500` or `indigo-600`.

## 6. Before you say "done"

1. `npm test` passes (add tests to `app/utils/__tests__/` when you change `bcRules`, `phone` or `tokens`).
2. `npm run lint` shows no errors in the files you touched.
3. `npm run build` succeeds.
4. You checked the screen in a browser at **360px** and at desktop width, using `ZZTEST` data.
5. The day's log (`YYYY-MM-DD/done.md`, `next.md`, `remaining.md`) is updated.
6. `CODEBASE_KNOWLEDGE.md` is updated if routes or pages changed.
