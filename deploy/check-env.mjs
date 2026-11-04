// Run before migrations. Prints variable NAMES only, never values.
const required = ['DATABASE_URL', 'AUTH_SECRET', 'AUTH_URL']
const warnIfMissing = {
  'Sign-in (need Google or email)': () => (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) || (process.env.AUTH_RESEND_KEY && process.env.EMAIL_FROM),
  'ANTHROPIC_API_KEY (AI companion will say it is unavailable)': () => process.env.ANTHROPIC_API_KEY,
  'ADMIN_EMAILS (nobody can moderate the community)': () => process.env.ADMIN_EMAILS,
  'NEXT_PUBLIC_VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY (push notifications off)': () => process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
}
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  console.error('MISSING REQUIRED ENV:', missing.join(', '))
  process.exit(1)
}
if (!/^https:\/\//.test(process.env.AUTH_URL)) console.warn('WARN  AUTH_URL should start with https:// in production')
for (const [label, ok] of Object.entries(warnIfMissing)) if (!ok()) console.warn('WARN  not set:', label)
console.log('env check passed')
