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

## JSS Next.js app: verified state (local Postgres 16, 2026-10-18)
Working: install, build (22 routes), `prisma migrate deploy`, `db:seed` (13 milestones, 6 resources), `/api/health`, all dashboard pages with a DB session, APIs for sobriety date, check-in, milestones, journal, posts. Middleware fixed (Prisma can't run on Edge; now cookie-presence check, real auth in layout/routes).
NOT tested: Google/Resend sign-in, push notifications (no VAPID keys), comments/likes UI in a browser, deployment.
Missing: AI companion + crisis detection in the Next app (exists only in old PWA `app-src/src/screens/SoberGuide.jsx`), privacy policy/terms, community moderation (report/remove), analytics, hosting.
Likely problems (untested): Railway release command runs `tsx prisma/seed.ts` but `tsx` is a devDependency not in the runner image.

## Plan proposed (not yet started past Day 1)
Day 2: 988/crisis resources on every page; port AI companion + crisis detection. Day 3: community report/remove tools; privacy/terms drafts (marked for lawyer review). Day 4: staging deploy with real sign-in. Day 5: QA + soft launch. If moderation isn't ready, launch with the community feed off.

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
