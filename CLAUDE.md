# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next.js dev server (PWA disabled in development)
npm run build    # production build (runs next-pwa, emits service worker to /public)
npm run start    # serve the built app
npm run lint     # next lint
```

No test runner or formatter is configured. Required env vars (in `.env`, gitignored): `MONGO_URI`, `JWT_SECRET`, `SMTP_EMAIL`, `SMTP_PASSWORD`.

## Architecture

Next.js 14 App Router app for managing ROSCA-style savings "committees". Single Mongo database, Mongoose models, JWT auth. JS and TS files coexist freely (`tsconfig.json` has `strict: false` and `allowJs: true`). Spelling note: the domain noun appears as both "committee" and "committie" — match the spelling already used in the surrounding file/URL rather than normalizing.

### Three roles, two token stores

The same Mongo cluster serves two distinct user types, each with its own localStorage keys and JWT:

- **Admin / Organizer** (`Admin` model, `isAdmin: true`) — tokens stored as `admin_token` + `admin_detail`. Lives under `/app/admin/*` and uses `app/admin/apis.js`. New organizer signups default to `status: "pending"` and require Super Admin approval.
- **Super Admin** — same `Admin` model with `isSuperAdmin: true` (set manually in DB). Sidebar items in `app/admin/AdminLayout.jsx` are conditionally rendered for super admins (Approvals, System Control, Audit Logs, Create Organizer).
- **Member** (`Member` model) — tokens stored as `token` + `userDetail`. Lives under `/app/userDash/*` and uses `app/userDash/apis.js`. Auto-approved on signup.

When adding a protected page or API call, pick the correct localStorage key — using `token` on an admin page (or vice versa) silently bypasses auth.

### Auth: do not trust the middleware

`middleware.js` only checks for the *presence* of an `Authorization` header on `/api/admin/*` and `/api/member/*`. It does **not** verify the JWT (Edge runtime constraints). Real verification happens inside each route handler via the helpers in `app/utils/auth.js`:

- `verifyAdmin(req)` — requires JWT with `isAdmin: true`
- `verifyMember(req)` — requires JWT with `userId` and `!isAdmin`
- `verifyAuthenticatedUser(req)` — any valid JWT
- `unauthorizedResponse(authResult)` — standard 401/403 reply

Every new API route that handles sensitive data MUST call one of these and derive identity from the decoded JWT (`auth.user.userId`), not from request body/query IDs. The audit report (`AUDIT_REPORT.md`) flags several existing routes that violate this — treat them as bugs to fix, not patterns to copy.

For super-admin-only operations, call `verifyAdmin` and additionally look up the `Admin` document to check `isSuperAdmin` (see `app/api/committee/route.js` GET for the pattern: super admin sees all committees, regular admin sees only `createdBy: self`).

### Mongo connection

`app/utils/db.js` exposes a single `connectToDatabase()` that memoizes the connection on `global.mongoose` (standard Next.js pattern to survive hot reloads and serverless invocation). Always `await connectToDatabase()` at the top of an API handler before touching models. `strictPopulate` is disabled globally.

### Models (`app/api/models/`)

- `Committee` — embeds `members[]`, `pendingMembers[]`, `payments[]` (per month, per member, with `status: unpaid|pending|verified|rejected`), `payouts[]`, and `result[]` (final payout order). Lifecycle: `open → full → ongoing → finished`, advanced by `currentMonth`. `createdBy` links to the owning Admin.
- `Member` — has both a legacy single `committee` ref and a `committees[]` array; new code should use the array. Has `organizers[]` + `pendingOrganizers[]` for the association/request-approval flow. `2dsphere` index on `location.coordinates` (GeoJSON `[lng, lat]`).
- `Admin` — `2dsphere` index on `location`. `verificationStatus` and `isSuperAdmin` are independent.
- `Asset` — receipts, NIC images, payout proofs. Stored as **base64 in Mongo** (not S3/disk) and served via `GET /api/assets/[id]`. Upload via `POST /api/assets` with `{ name, data, contentType, uploadedBy, onModel }`.
- `Log` — append-only audit trail. Write via `createLog({ action, performedBy, onModel, details, targetId })` from `app/utils/logger.js` whenever an admin mutates state.
- `Message`, `Notification`, `Review`, `Settings` — chat, in-app notifications, organizer reviews, and global settings.

### Discovery / Near Me

`GET /api/discovery` powers `/userDash/near-me`. Uses MongoDB `$near` against the `2dsphere` indexes on `Admin.location` and `Member.location` (default 50km radius). Coordinates are stored `[lng, lat]` per GeoJSON convention — do not flip them. **Do not include NIC/document fields in discovery responses** (audit P0 finding).

### Layout & client-only auth gates

- `app/layout.tsx` is the global shell: fonts, `ThemeProvider`, `LanguageProvider` (EN/UR with RTL), `ClientNavbar`, `PWAInstallBar`, toast container.
- `app/admin/layout.jsx` → `AdminLayout.jsx` renders the organizer sidebar; nav items are filtered by `isSuperAdmin` read from `localStorage.admin_detail`.
- `app/admin/LayoutChecker.jsx` is a client-only redirect gate that pushes to `/admin/login` if `admin_token` is absent. This is UX-only — never rely on it for authorization; the API route is the source of truth.

### Path aliases (`tsconfig.json`)

- `@/*` → repo root (most imports use this, e.g. `@/app/utils/db`)
- `@components/*` → `./app/components/*`
- `@utils/*` → `./app/utils/*`

### Styling & i18n

Tailwind with a custom `primary` (indigo) and `secondary` (slate) palette in `tailwind.config.ts`. Dark mode via `dark:` classes. RTL handling lives in `LanguageContext` — when adding UI, check `isRTL` from `useLanguage()` for directional classes (`mr-`/`ml-`, `rotate-180` on chevrons, etc.).

## Repo hygiene notes

- `.env` is in `.gitignore` but was committed in an earlier history; current `MONGO_URI`/`JWT_SECRET` should be treated as compromised and rotated before any production use.
- Backup files like `app/pageBackup.tsx` and `app/admin/manage/page copy.jsx` are dead code left over from in-progress refactors — don't import them, don't extend them.
- Two `Committie.jsx` components exist (`app/admin/Committie.jsx` and `app/Components/Committie.jsx`) and two manage routes (`/admin/manage` and `/admin/manage-committie`) — confirm which one is wired up via the sidebar (`AdminLayout.jsx`) before editing.
- `AUDIT_REPORT.md` enumerates known security and architectural debt; when you touch an affected file, prefer fixing the listed issue over working around it.
