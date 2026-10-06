# 2026-10-06 — Next (in order)

1. **Owner review.** Run `npm run dev`, then try the screens on your phone. Ask Claude to commit the branch `revamp-2026-10` when you are happy.
2. **Rotate secrets (owner, before deploy).** See remaining.md, section "Deploy steps".
3. **Deploy + migrate.**
   1. Take an Atlas snapshot.
   2. Deploy the branch to Vercel.
   3. Run `node --env-file=.env scripts/migrate-2026-10.mjs --apply`.
   4. Run it again without `--apply`. It should report 0 changes.
4. **Family pilot.**
   1. Create one real BC.
   2. Add 3–4 family members using WhatsApp invites.
   3. Watch where people get stuck and note it in the next day's folder.
5. **Small polish found while testing:**
   - On phone, the BC page's **More** button sits alone under the title. Consider a small icon button next to the title.
   - Long names truncate in the "Gets the pot" card. Allow two lines.
   - Move the few labels written directly in pages ("City", "Load more", "Follow", "Find members", "Organizers", "Activity log") into `app/utils/words.js`.
   - Status pills wrap the Urdu onto a second line on narrow cards. Consider showing only one language inside pills.
6. **Nice to have:**
   - Playwright smoke test for the main screens. `@playwright/test` is already a dev dependency.
   - A "remove photo" option for ID documents. The API currently ignores empty values.
