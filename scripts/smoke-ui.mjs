// Browser smoke test (Playwright): report flow, crisis notices, delete, companion, admin, mobile-safe pages.
// Needs: npm i -D playwright-core; app on localhost:3000 (ADMIN_EMAILS=admin@example.com); run scripts/smoke-reset.sh
// and create one post by u5 first. Usage: node scripts/smoke-ui.mjs <screenshot-dir>. Verified: 14/14 on 2026-11-04.
import { chromium } from 'playwright-core'
import fs from 'fs'
const exe = fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium')).map(d => `/opt/pw-browsers/${d}`)
let executablePath
for (const d of exe) { for (const p of ['chrome-linux/chrome','chrome-linux64/chrome','chrome']) { if (fs.existsSync(`${d}/${p}`)) executablePath = `${d}/${p}` } }
if (!executablePath && fs.existsSync('/opt/pw-browsers/chromium')) executablePath = '/opt/pw-browsers/chromium'
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] })
const out = process.argv[2]
const results = []
const ok = (n, v) => { results.push([n, v]); console.log((v ? 'PASS  ' : 'FAIL  ') + n) }

async function as(token) {
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } })
  await ctx.addCookies([{ name: 'authjs.session-token', value: token, domain: 'localhost', path: '/' }])
  const page = await ctx.newPage()
  page.on('dialog', d => d.accept())
  return page
}

// u4 (Casey) reports a post from the community page
let page = await as('tok4')
await page.goto('' + (process.env.BASE_URL || 'http://localhost:3000') + '/community')
ok('community page loads with feed', await page.locator('text=Community guidelines').count() > 0)
await page.screenshot({ path: `${out}/community.png` })
const reportBtn = page.locator('button', { hasText: /^Report$/ }).first()
ok('Report button visible on others\' posts', await reportBtn.count() > 0)
await reportBtn.click()
ok('report dialog opens', await page.locator('text=Report this post').isVisible())
await page.screenshot({ path: `${out}/report-dialog.png` })
await page.selectOption('select >> nth=0', 'spam').catch(()=>{})
await page.locator('button', { hasText: 'Send report' }).click()
await page.waitForSelector('[role=status]', { timeout: 5000 }).catch(()=>{})
ok('confirmation notice shown after report', (await page.locator('[role=status]').innerText().catch(()=>'')).includes('Thank you'))

// crisis note after posting crisis language
await page.fill('textarea', 'I want to die tonight')
await page.locator('button', { hasText: 'Share' }).click()
await page.waitForSelector('[role=alert]:has-text("988")', { timeout: 5000 }).catch(()=>{})
ok('crisis resources shown after crisis post', (await page.locator('[role=alert]:has-text("988")').first().innerText().catch(()=>'')).includes('988'))
await page.screenshot({ path: `${out}/crisis-after-post.png` })

// author sees Delete on own post, not Report
const own = page.locator('div.bg-gray-900\\/60', { hasText: 'I want to die tonight' }).first()
ok('author sees Delete (not Report) on own post', await own.locator('button', { hasText: 'Delete' }).count() > 0 && await own.locator('button', { hasText: 'Report' }).count() === 0)
await own.locator('button', { hasText: 'Delete' }).click()
await page.waitForTimeout(800)
ok('own post removed after Delete', await page.locator('text=I want to die tonight').count() === 0)

// companion page
await page.goto('' + (process.env.BASE_URL || 'http://localhost:3000') + '/companion')
ok('companion page shows disclaimer', (await page.locator('body').innerText()).includes('not a therapist'))
await page.fill('input[placeholder="Type here…"]', 'I want to kill myself')
await page.locator('button', { hasText: 'Send' }).click()
await page.waitForSelector('[role=alert]:has-text("988")', { timeout: 8000 }).catch(()=>{})
ok('companion shows 988 banner on crisis message (no API key)', (await page.locator('[role=alert]:has-text("988")').first().innerText().catch(()=>'')).includes('988'))
await page.screenshot({ path: `${out}/companion.png` })

// admin
page = await as('tok3')
await page.goto('' + (process.env.BASE_URL || 'http://localhost:3000') + '/admin/reports')
ok('admin sees moderation queue', (await page.locator('h1').innerText()).includes('Moderation'))
ok('admin nav link present', await page.locator('a', { hasText: 'Moderation' }).count() > 0)
await page.screenshot({ path: `${out}/admin.png` })
const hide = page.locator('button', { hasText: /^Hide$/ }).first()
if (await hide.count()) { await hide.click(); await page.waitForTimeout(1000) }

// non-admin
page = await as('tok4')
const r = await page.goto('' + (process.env.BASE_URL || 'http://localhost:3000') + '/admin/reports')
ok('non-admin gets 404 on admin page', r.status() === 404)
ok('non-admin has no Moderation link', await (async()=>{await page.goto('' + (process.env.BASE_URL || 'http://localhost:3000') + '/dashboard'); return await page.locator('a', { hasText: 'Moderation' }).count() === 0})())

// profile delete flow visible
await page.goto('' + (process.env.BASE_URL || 'http://localhost:3000') + '/profile')
ok('profile has Delete my account section', await page.locator('text=Delete my account').count() > 0)

await browser.close()
const failed = results.filter(r => !r[1]).length
console.log(`\nUI RESULT: ${results.length - failed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
