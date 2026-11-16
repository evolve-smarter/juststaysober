// Automated accessibility audit (axe-core, WCAG 2.0/2.1 A+AA) of every page at phone and desktop width.
// Needs the app on localhost:3000 and test users (scripts/smoke-reset.sh) plus one post. Automated checks catch only
// part of real accessibility problems; this is a baseline, not a full audit. Verified: 0 violations on 2026-11-16.
import { chromium } from 'playwright-core'
import fs from 'fs'
let executablePath
for (const d of fs.readdirSync('/opt/pw-browsers').filter(d => d.startsWith('chromium-'))) for (const p of ['chrome-linux/chrome','chrome-linux64/chrome']) if (fs.existsSync(`/opt/pw-browsers/${d}/${p}`)) executablePath = `/opt/pw-browsers/${d}/${p}`
const axe = fs.readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const b = await chromium.launch({ executablePath, args: ['--no-sandbox'] })
const pages = [['landing','/',null],['login','/login',null],['signup','/signup',null],['privacy','/privacy',null],['dashboard','/dashboard','tok4'],['community','/community','tok4'],['companion','/companion','tok4'],['journal','/journal','tok4'],['milestones','/milestones','tok4'],['resources','/resources','tok4'],['profile','/profile','tok4']]
const all = {}
for (const vp of [{ name: 'phone', width: 390, height: 844 }, { name: 'desktop', width: 1200, height: 900 }]) {
  const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height } })
  await ctx.addCookies([{ name: 'authjs.session-token', value: 'tok4', domain: 'localhost', path: '/' }])
  for (const [name, path, tok] of pages) {
    const p = await ctx.newPage()
    if (!tok) await ctx.clearCookies()
    else await ctx.addCookies([{ name: 'authjs.session-token', value: tok, domain: 'localhost', path: '/' }])
    await p.goto('http://localhost:3000' + path, { waitUntil: 'networkidle' })
    await p.addScriptTag({ content: axe })
    const r = await p.evaluate(async () => await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] }))
    for (const v of r.violations) {
      const k = `${v.id} [${v.impact}]`
      all[k] ??= { help: v.help, where: new Set(), nodes: 0, sample: v.nodes[0]?.html?.slice(0, 110) }
      all[k].where.add(`${name}/${vp.name}`); all[k].nodes += v.nodes.length
    }
    await p.close()
  }
  await ctx.close()
}
await b.close()
const rows = Object.entries(all).sort((a, b) => b[1].nodes - a[1].nodes)
if (!rows.length) console.log('No WCAG A/AA violations found by axe on any page.')
for (const [k, v] of rows) console.log(`${k}  nodes=${v.nodes}  pages=${v.where.size}\n   ${v.help}\n   e.g. ${v.sample}`)
