# Deploying the Cloudflare Worker Proxy

The Cloudflare Worker sits between the JustStaySober PWA and the Anthropic API.
It keeps the API key off the client entirely. Free tier: 100,000 requests/day.

---

## Prerequisites

- A Cloudflare account (free at cloudflare.com — no credit card needed)
- Node.js installed

---

## Steps

### 1. Install Wrangler (Cloudflare's CLI)
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```
This opens a browser tab — approve the login. You'll only need to do this once.

### 3. Navigate to the proxy folder
```bash
cd proxy
```

### 4. Set the Anthropic API key as a secret
```bash
wrangler secret put ANTHROPIC_API_KEY
```
When prompted, paste the Anthropic API key.
(Find it in `~/.openclaw/agents/main/agent/auth-profiles.json` under the `anthropic:default` profile.)

### 5. Deploy the worker
```bash
wrangler deploy
```

You'll see output like:
```
✅ Deployed juststaysober-proxy
   https://juststaysober-proxy.YOUR-SUBDOMAIN.workers.dev
```

Copy that URL.

### 6. Update SoberGuide.jsx with the real URL

Open `app-src/src/screens/SoberGuide.jsx` and update the `PROXY_URL` at the top:

```javascript
// Change this:
const PROXY_URL = 'https://juststaysober-proxy.beqprod.workers.dev'

// To your actual URL:
const PROXY_URL = 'https://juststaysober-proxy.YOUR-SUBDOMAIN.workers.dev'
```

### 7. Rebuild and push

```bash
cd app-src
npm run build
cd ..
git add -A
git commit -m "fix: update proxy URL to real Cloudflare Worker endpoint"
git push
```

---

## Testing

After deployment, test the proxy directly:

```bash
curl -X POST https://juststaysober-proxy.YOUR-SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-haiku-4-5","max_tokens":50,"messages":[{"role":"user","content":"Say hi"}]}'
```

You should get a valid Anthropic API response back.

---

## Files

| File | Purpose |
|------|---------|
| `proxy/worker.js` | The Cloudflare Worker code |
| `proxy/wrangler.toml` | Worker config (name, compatibility) |

---

## Notes

- The API key is stored as a Cloudflare Worker Secret — never in code or git
- CORS is open (`*`) since the PWA is client-side
- If you want to restrict to your domain only, change `Access-Control-Allow-Origin: *` to `https://evolve-smarter.github.io`
- Worker URL format: `juststaysober-proxy.[cloudflare-username].workers.dev`
