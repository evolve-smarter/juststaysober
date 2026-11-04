# Deploying JustStaySober (web app)

Plain-language checklist. Anything marked **VERIFY** came from general knowledge or a web search,
not from a test, so check it against the provider's current docs. Never paste keys into chat or
commit them; put them in the host's environment-variable settings.

## 1. Accounts you create (owner)
| What | Why | Cost note |
|---|---|---|
| Hosting: Railway (config is ready) | runs the app + Postgres | usage-based; set a spend cap |
| Google Cloud OAuth client | "Sign in with Google" | free |
| Resend | emails the sign-in link | free tier exists; **VERIFY** limits |
| Anthropic API key | the AI companion | pay-per-message; **set a monthly spend limit in the Anthropic console first** |
| Domain (e.g. juststaysober.com) | the public address | yearly fee |

## 2. Environment variables
Required (deploy stops with a clear message if missing): `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`.

| Name | Value |
|---|---|
| `DATABASE_URL` | from the Postgres service (Railway: reference variable) |
| `AUTH_SECRET` | random string: `openssl rand -base64 32` |
| `AUTH_URL` | the public https address, e.g. `https://juststaysober.com` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Cloud console |
| `AUTH_RESEND_KEY`, `EMAIL_FROM` | Resend; `EMAIL_FROM` must be on a domain verified in Resend |
| `ANTHROPIC_API_KEY` | Anthropic console |
| `COMPANION_MODEL` | optional; default `claude-opus-5-5`. A cheaper model is your call (see notes) |
| `ADMIN_EMAILS` | comma-separated emails allowed to moderate (`/admin/reports`) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL` | `npx web-push generate-vapid-keys`; optional (push off without them) |

## 3. Steps
1. Railway: New Project -> Deploy from GitHub repo -> choose the branch. Add the Postgres plugin.
2. Set the variables above. `NEXT_PUBLIC_*` values must exist **at build time**.
3. Deploy. The pre-deploy step (`deploy/predeploy.sh`) checks env, applies database migrations and
   loads starter data. **VERIFY** on the first deploy that Railway ran it (see the deploy logs).
4. Add the custom domain in Railway and point DNS at it. Then set `AUTH_URL` to that address and redeploy.
5. Google: OAuth consent screen + OAuth client (Web). Authorized redirect URI:
   `https://YOUR-DOMAIN/api/auth/callback/google` (Auth.js v5 default path; **VERIFY** in the console).
6. Resend: add and verify your sending domain (DNS records), create an API key.
7. Sign in once with your own email, then put that email in `ADMIN_EMAILS` and redeploy.

## 4. After deploy: smoke test (about 10 minutes)
- `https://YOUR-DOMAIN/api/health` shows `{"status":"ok","db":"connected"}`
- Sign up with a fresh email: the sign-in email arrives and the link works.
- Sign in with Google.
- Set a sobriety date, do a check-in, write a journal entry.
- Sober Guide: send "I had a good day" (normal reply) and a crisis phrase (shows 988). **Read the real replies yourself.**
- Community: post, post anonymously, comment, report from a second account, block, delete; confirm an anonymous post shows no name.
- Moderation page opens for your admin email and returns 404 for everyone else.
- Delete a test account from Profile.
- Phone: open the site on a real phone; the menu and "Help: 988" button work.

## 5. Before telling the public
- Lawyer reviews `/privacy`, `/terms`, `/guidelines` (they show a DRAFT banner; remove it only after review).
- Someone is named to review reports daily, or turn the community off.
- Verify every phone number shown (988, 741741, 1-800-662-4357).
- Decide the AI model/cost, and watch the first week's Anthropic spend.

## 6. Rollback
Railway keeps previous deployments: redeploy the last good one. Database migrations are not
automatically reversible; take a database backup before any deploy that changes `prisma/migrations`.

## Known limits
- Rate limits are in memory per server instance; fine for one instance.
- No data-export feature yet (the privacy draft has a placeholder).
- Push notifications untested.
