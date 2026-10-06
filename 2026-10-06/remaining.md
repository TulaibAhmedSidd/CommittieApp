# 2026-10-06 — Remaining

## Deploy steps (owner)
- [ ] **Rotate every secret.** The old `.env` is in git history, which also means GitHub.
  - [ ] MongoDB Atlas: change the database user password and update `MONGO_URI`.
  - [ ] Gmail: revoke the old app password, make a new one, and update `SMTP_PASSWORD`.
  - [ ] New `JWT_SECRET`: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Everyone will need to log in again once, which is fine.
  - [ ] In Vercel env vars, set the four values above plus `APP_URL` and `NEXT_PUBLIC_APP_URL` = `https://committie-app.vercel.app`. Do **not** set `MAIL_MODE` in production.
- [ ] Atlas snapshot or `mongodump`.
- [ ] Deploy `revamp-2026-10`.
- [ ] Run `node --env-file=.env scripts/migrate-2026-10.mjs --apply`, then run it again without `--apply` to confirm there are 0 changes.
- [ ] Optional: rewrite git history to remove the old `.env`. Rotating the secrets is what matters.

## Milestone checklist
- [x] Phase 0: setup (branch, .env untracked, lint, vitest, `autoIndex` off)
- [x] Phase 1: security + broken flows
- [x] Phase 2: organizer redesign (home, BCs, create, BC page, members, invite, organizers)
- [x] Phase 3: member redesign + public pages + cleanup
- [x] Rules for agents (`AGENTS.md`, `docs/DESIGN_SYSTEM.md`)
- [ ] Owner review + commit
- [ ] Secrets rotated, deployed, migration applied
- [ ] Family pilot feedback

## Known limits / decisions to revisit
- **Images** are still stored as base64 in MongoDB (max 1.5 MB each after compression). Fine for a family app; move them to object storage if usage grows.
- **No SMS.** Phone-only members reset their password through a WhatsApp link from their organizer. Phone-only organizers go to the super admin.
- **Light theme only.** Dark mode was removed for simplicity.
- **Old BCs** (`rulesVersion 1`) keep their duration; the turn order wraps around when months > members.
- **Members cannot browse other members.** Only organizers can, in "Find members". Members can still find BCs and organizers.

## Questions for the owner
- Is the WhatsApp invite text OK? It is in `app/utils/invites.js`.
- Should a member who joined with your invite link also be added straight into a BC, or only to your members list (the current behaviour)?
