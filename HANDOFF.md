# Handoff: Just Stay Sober + VC Shine / RecoveryRoots

Written 2026-10-21 by Claude (cloud session) so a local session on the Mac mini can continue.
Everything here was read or run; items marked **UNKNOWN** were not found. Do not fill gaps with invented data.

## Owner's rules (non-negotiable)
- Never invent facts, data, reviews, scripts or research. If you don't know, say "I don't know".
- Outreach scripts must come from the Offline Sharks training (Tom Gaddis / Nick Ponte), not be made up.
- Do not spend money, buy domains, publish live, or message anyone outside without the owner's explicit yes.
- Report outcomes faithfully: what was tested vs. what was not.

## Projects
1. **Just Stay Sober (JSS)**: free sobriety app. This repo.
   - Old live version: landing page `index.html` + Vite PWA (`app-src/`, built output now in `legacy-pwa-dist/`). GitHub Pages: evolve-smarter.github.io/juststaysober/. Has Meeting Guide meeting finder, AI chat via Cloudflare Worker proxy (`proxy/`), crisis keyword detection, onboarding. Proxy deployment is UNKNOWN.
   - New Next.js 15 app (`src/`, Prisma/Postgres, NextAuth, web-push). Branch `claude/mac-mini-thread-compat-npxhnu`.
2. **VC Shine** (thrive.vcshine.org, GHL + Smart Directory AI by Offline Sharks): Ventura County local business directory, free listings, used to start friendly outreach. Plan: give every business a premium listing; make it nicer; replace old vcshine.org (Vercel build had fabricated ratings, must be removed).
3. **RecoveryRoots.com**: recovery version of VC Shine for treatment facilities (real public data only, claim flow into GHL CRM). Source: owner's master plan, Slack #cypher-claude, 2026-09-28 11:15 PT (ts 1790619344.051629).

## Decisions the owner stated
- JSS is **free** for people getting sober. Optional small "power user" upgrade, $4.99 or $9.99 (owner's idea).
- Bigger revenue idea: **license a facility-branded version** of the app to treatment facilities; possible "Life360-like" client tracking. (Open: owner has not yet said whether this means location tracking or opt-in check-ins/engagement. Claude recommended starting with opt-in check-ins and getting legal advice before any location tracking.)
- **No facility visibility or paid placement inside the JSS app.** RecoveryRoots is the directory where facilities are listed.
- RecoveryRoots is about **fit**, not "best". An overall rating might come from Google reviews (UNVERIFIED: check Google Places terms on storing/displaying ratings).
- Owner's master plan compliance note: treatment marketing is regulated (EKRA, California patient-brokering rules, Google/LegitScript). **Flat listing/advertising fees only, never per-lead or per-admission; legal review before charging treatment providers.** These claims are the owner's plan, not independently verified.
- Owner wants JSS launched ASAP; app stores are not realistic in week one.

## JSS Next.js app: state as of 2026-11-04 (branch claude/mac-mini-thread-compat-npxhnu)
Verified locally (Postgres 16, built app, curl + Playwright):
- Build, migrations (init + community_moderation), seed, all pages, sobriety/check-in/milestones/journal APIs.
- **Day 2:** `/companion` Sober Guide chat + `/api/companion` (auth, validation, 30 msg/hr limit, no message storage/logging). Crisis detection with word boundaries (old PWA substring match flagged "good"/"God"); crisis resources returned even if the model fails, declines or the user is rate limited; 988/SAMHSA/911 in every dashboard page. System prompt ported verbatim from the PWA. Server-side refusal fallbacks enabled. 21 crisis test cases (`npx tsx scripts/test-crisis.ts`).
- **Day 3:** FIXED a privacy bug: anonymous posts/comments leaked the author's real userId, and the feed was readable without login. Now auth required; anon content has no userId/name in payloads. Added report (6 reasons; auto-hide after 3 distinct reporters, EXCEPT self-harm reports which are never auto-hidden and go first in the admin queue), block (by post/comment id so anon authors stay hidden; mutual), delete own post/comment, suspend-from-posting, admin queue at `/admin/reports` (admins = `ADMIN_EMAILS` env var), account deletion (Profile -> Delete my account, `DELETE /api/account`, cascades), draft `/privacy`, `/terms`, `/guidelines` (visible DRAFT banner, [brackets] for unknowns), legal links in landing footer.
- **Mobile:** the dashboard layout was unusable on phones (sidebar left 134px of a 390px screen). Added a top bar with "Help: 988" and a menu drawer; pages now use the full width.
- Tests: `scripts/smoke-reset.sh`, `scripts/smoke-community.sh` (52/52), `scripts/smoke-ui.mjs` (14/14), `scripts/test-crisis.ts`. They use a local TEST database only.

NOT tested: a real AI reply (no Anthropic key in the cloud env), Google/Resend sign-in, push notifications (no VAPID keys), deployment, the draft pages' accuracy with a lawyer.
Known gaps: no data export; in-memory rate limits are per-instance; push/VAPID keys needed (`npx web-push generate-vapid-keys`); privacy draft says "no analytics" - verify before launch; Railway release command runs `tsx` (devDependency, not in the runner image) so the seed step will likely fail there.
Env vars: DATABASE_URL, AUTH_SECRET, AUTH_URL, GOOGLE_CLIENT_ID/SECRET, AUTH_RESEND_KEY, EMAIL_FROM, ANTHROPIC_API_KEY, COMPANION_MODEL (optional, default claude-opus-5-5), ADMIN_EMAILS, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY.

## Day 4 prep (2026-11-04)
- FIXED: the Railway release step could not have worked: the production image had no `prisma/` folder (schema + migrations), no Prisma CLI, and no `tsx` (the seed ran through it); `[[deploy.releaseCommand]]` is not a Railway key (documented key: `preDeployCommand`, a list). Now: pinned Prisma CLI installed in `/migrate` in the image, `prisma/` and `deploy/` copied in, seed converted to plain `prisma/seed.mjs`, `deploy/predeploy.sh` = env check -> `migrate deploy` -> seed. Tested by recreating the image layout under /app and /migrate: fresh empty DB (2 migrations applied, seed ok), second run idempotent, missing env fails with a clear message, `node server.js` serves pages and `/api/health`, and the production `__Secure-authjs.session-token` cookie works. The actual `docker build` now passes (see 2026-11-16 below). NOT tested: Railway's handling of the list-form `preDeployCommand` (VERIFY on first deploy).
- REMOVED the seeded "Summit Malibu" treatment-center listing from the app's Resources (owner decision: no facility visibility in the free app; seed also deletes it from existing DBs). Resources page still has a "Treatment Centers" category label (now empty).
- Added `.dockerignore`, security headers (nosniff, frame deny, referrer, permissions, HSTS), removed X-Powered-By, `deploy/check-env.mjs`, `DEPLOY.md` (owner checklist: accounts, env vars, steps, smoke test, rollback).

## Session of 2026-11-16 (hosting + polish)
- Owner decisions: host on Hostinger (use a VPS with Docker; Node.js web hosting advertises MySQL only, app needs PostgreSQL); GHL for CRM/outreach/VC Shine, not for hosting the app. Domains now allowed in the cloud env: offlinesharks.com, smartdirectory.ai, vcshine.org, thrive.vcshine.org, dl-cdn.alpinelinux.org. clockworkclients.com is a ClickFunnels page behind Cloudflare bot protection and blocks automated clients: the owner must export that content.
- `deploy/` = VPS stack: `docker-compose.yml` (PostgreSQL + app + Caddy auto-HTTPS), `Caddyfile`, `backup.sh`, `.env.example`, `HOSTINGER.md` (plain-language steps, hardening, backups, updates). TESTED with the real production image built from the Dockerfile (`docker build` now passes; use `--build-arg NODE_IMAGE=mirror.gcr.io/library/node:22-alpine` if Docker Hub rate-limits): migrations + seed on a fresh volume, health check, HTTPS through Caddy, security headers, db/app ports not published, backup AND restore (row counts matched). NOT tested: a real domain/certificate, a real Hostinger VPS, memory needs of building on a small VPS.
- App polish: web manifest + sunrise icons (installable), theme color, friendly 404/error pages (988 shown), removed unearned "Vetted"/"Verified" claims on Resources, email sign-in rate limit (20/hour/address) to stop email-flooding.
- Security: `npm audit fix` cleared the two critical advisories (Next.js 15.5.29: image-optimization RCE; Auth.js 5.0.0-beta.32: email normalization) and zod was moved to 4.x (DoS advisory). Remaining advisories are build-time tooling (prisma CLI deps, postcss). Suites re-run on the new versions: 52/52 API, 14/14 browser, 21/21 crisis.
- Test harness is in the repo: `scripts/cloud-test-env.sh [--build]` (local Postgres + app), `scripts/smoke-reset.sh`, `scripts/smoke-community.sh` (needs `PGHOST=/tmp PGPORT=5433`), `scripts/smoke-ui.mjs <dir>`, `scripts/test-crisis.ts`. The cloud scratchpad is wiped between sessions; do not keep tools only there.
- Findings about VC Shine (owner's directory): vcshine.org (behind Cloudflare) serves a directory claiming 380 listings with "nobody pays to rank" promises; I could not verify the listings are real or who built it. thrive.vcshine.org fails its TLS handshake from the cloud env (resolves to 104.236.53.124): check from a phone and check SSL in the GHL/domain settings. SmartDirectoryAI (vendor page): Starter $99/mo, Plus $299/mo, Pro $499/mo; claimable listings, premium plans, coupons, inbound/outbound AI agents (vendor claims).
- FINAL CHECK on the production image (2026-11-16, Next 15.5.29 inside): full stack via `deploy/docker-compose.yml` (db + app + Caddy); API 52/52, browser 14/14, axe 0 WCAG A/AA violations on 11 pages x phone+desktop, manifest/404/headers/sign-in limiter OK. Accessibility fixes: labels tied to fields, gray text contrast, locked milestones no longer dimmed to illegibility (`scripts/a11y-audit.mjs`).
- `docs/VCSHINE-QA.md`: launch/QA checklist for the VC Shine directory for a session that has the owner's GHL/DNS logins (nothing in it was run against the admin side).
- Small product notes: the Profile has a "Show sobriety days publicly" toggle but nothing in the app displays it publicly (stored only) - decide whether to remove it; the app has no Find Meetings yet.
- Briefs for the owner to correct: Drive doc "Project briefs: Just Stay Sober + VC Shine + RecoveryRoots (for Bryce to correct)".
- Still needs the owner: Hostinger VPS purchase/answer, Google/Resend/Anthropic keys (via env settings, not chat), VC Shine prices + Stripe OK, lawyer for privacy/terms/facility licensing/outreach consent, someone to review community reports, Offline Sharks scripts export, meeting data source decision.

## Plan status
Day 1 build fixes: done. Day 2 companion + crisis safety: done (real model reply untested). Day 3 community moderation + draft legal pages + mobile layout: done. Next: Day 4 staging deploy with real sign-in (needs owner's hosting/Google/Resend/Anthropic accounts via environment secrets), Day 5 QA + soft launch. If moderation staffing is not ready, launch with the community feed off.

## Where the original specs may be (UNKNOWN, not found from the cloud session)
Obsidian vault, `~/.openclaw/` (the old BUILD-LOG mentions an OpenClaw agent "Nexus" and `~/.openclaw/agents/main/agent/auth-profiles.json`), Claude Code history, Hermes. Search these first for pricing, "meetings included" and facility-license notes; none were found in Slack or Drive.

## Related material
- Research notes (partial, public pages only): Google Doc "Offline Sharks / VCShine - research notes" in the owner's Drive (id 155pZDO-4dCXZz3n6-e22STMFwpvYMXEzqZamf4u4a74).
- Slack #cypher-claude has the VC Shine fix list and Team Queue sheet (Drive: "Team Queue").
- NOT read: Offline Sharks paid/gated training, Skool, YouTube transcripts, today's live with Tom Gaddis, smartdirectory.ai (blocked in the cloud session).

## Next steps for the local session
1. Read the Offline Sharks material and find the owner's original JSS/RecoveryRoots notes; write a one-page brief per project; get the owner to correct it.
2. Continue the JSS plan above using the owner's own accounts/keys (do not paste secrets into chat or commit them).
3. Do not merge this branch to main until the owner decides what happens to the old PWA (merging moves its files and breaks the live GitHub Pages URL).
