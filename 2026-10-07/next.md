# 2026-10-07 — Next

1. Watch both videos, then share them in the family WhatsApp group.
2. Demo data was re-seeded after the videos, so it is fresh again.
3. Before the real pilot, remove the demo data: `node --env-file=.env scripts/cleanup-test-data.mjs --apply`.
4. Still open from 2026-10-06:
   - Rotate secrets (new JWT_SECRET in Vercel before deploy).
   - Deploy `revamp-2026-10`.
