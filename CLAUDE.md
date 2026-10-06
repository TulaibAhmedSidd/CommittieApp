# CLAUDE.md

@AGENTS.md

Claude-specific notes (everything else is in AGENTS.md, which applies to all agents):

- UI work: read `docs/DESIGN_SYSTEM.md` first and build only with `app/ui/*` components.
- Commands: `npm run dev`, `npm run build`, `npm run lint`, `npm test`, `npm run migrate` (dry run; add `-- --apply` only when the owner asks).
- Preview: `.claude/launch.json` has `committie-dev` (port 3000).
- The dev database is the live one: use `ZZTEST` names for anything you create and clean up with `node --env-file=.env scripts/cleanup-test-data.mjs --apply`.
