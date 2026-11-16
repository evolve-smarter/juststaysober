# VC Shine: QA + launch checklist (for a session that has the owner's GHL / DNS logins)

Written 2026-11-16. Basis: what I fetched from the public sites and what the owner's Slack/Drive say.
Nothing here was run against the admin side (I have no logins). Rules from the owner: **real data only**
(no invented reviews, phones, badges or "claimed" flags), **no pay-to-rank**, paid placements always
**labeled**, and anything that publishes, spends money or messages outsiders waits for the owner's yes.

## 0. What I observed (2026-11-16, from a cloud sandbox)
- `https://vcshine.org` loads (served through Cloudflare): "VCShine: Ventura County's Local Business
  Directory", claims "380 local businesses", towns + categories, "claim or add your business", promises
  (locally owned first, no pay-to-rank, real reviews only, paid placements labeled). Footer lists a phone
  and a contact email.
- `https://thrive.vcshine.org` resolves (104.236.53.124) but the **HTTPS handshake fails** ("tlsv1 alert
  internal error"). Earlier in the session it loaded as a JavaScript app showing only "Loading...".
- Open items from the owner's Team Queue (Oct 3): redirect the old fake Vercel site to the real one; vcshine.org
  DNS fix; QA; paid plans + FOUNDER coupon + referral listings (needs owner's OK on prices and Stripe).
- The platform (SmartDirectoryAI by Offline Sharks, vendor page): claimable listings, premium plans, coupons,
  free-trial plans, inbound AI chat/voice agent, outbound AI dialer, CRM, email + SMS, funnels. Plans $99 /
  $299 / $499 per month (vendor). Whether the owner's account has the AI agents switched on is **unknown**.

## 1. Domains and security (do first)
- [ ] Decide the one canonical address (`vcshine.org` or `thrive.vcshine.org`). Everything else 301-redirects to it.
- [ ] `www.vcshine.org`, `vcshine.org`, `thrive.vcshine.org` each load over valid HTTPS (no certificate warnings), on a phone on cellular and on wifi.
- [ ] Fix the `thrive.vcshine.org` TLS failure (check the custom-domain / SSL status in GHL and the DNS record it expects).
- [ ] The old Vercel build (invented ratings, live `/api/inquiry` form) is gone or redirected. Owner OK required to change DNS/redirects.
- [ ] Email deliverability for outreach: SPF, DKIM, DMARC set for the sending domain; a physical mailing address and an unsubscribe link in every marketing email.
- [ ] SMS: A2P 10DLC registration is approved (Slack said an A2P submission was flagged for matching number/website/email). No texts before it is approved.

## 2. Content truth (the owner's hard rule)
- [ ] Open 20 random listings across towns/categories. Each phone, address, hours and website matches the business's own site or Google listing. Record the source for each.
- [ ] No star ratings, review counts, badges or "claimed" flags that were not earned. Search the page source for `rating`, `review`, `verified`, `claimed`.
- [ ] The "380 businesses" number equals the real count of live listings (or remove it).
- [ ] Franchise locations are labeled as the site promises; photos are licensed (the footer credits Wikimedia Commons: verify each license text).
- [ ] Privacy, Terms, Editorial Policy, About and Contact pages exist and match what the site really does. Privacy/Terms are templates that need a lawyer.

## 3. Owner claim flow (this is where outreach lands)
- [ ] "Claim or add your business" works end to end on phone: form submits, owner receives a confirmation, a GHL contact is created with tags (e.g. source = vcshine-claim) and the owner is notified.
- [ ] The consent checkbox says in plain words what the owner agrees to (emails? calls? texts?) and is **unchecked by default**. Consent is stored with a timestamp. A lawyer reviews this wording before any outbound call or text.
- [ ] Duplicate claims, wrong-person claims and removal requests have a path (a human reviews before a listing changes).
- [ ] Test with a throwaway contact: claim, edit, upgrade, unsubscribe, delete.

## 4. Premium listing for everyone (owner's decision)
- [ ] Define exactly what "premium" contains. Suggested rule: premium features add information (photos, services, hours, video, offers) and **never change ranking**; any paid placement is labeled.
- [ ] Create a free premium plan (or a coupon/free-trial that does not expire unexpectedly). Check what happens to a listing when a trial ends.
- [ ] Listing page looks finished on phone: cover photo, hours, services, map, call/directions buttons, no empty sections.
- [ ] Paid add-ons (if any) and the FOUNDER coupon: **owner sets prices and approves Stripe**. Test in Stripe test mode first.

## 5. AI chat / voice
- [ ] Switch on the inbound AI agent in the account (if the plan includes it). Give it a written script: friendly, helpful, not salesy; says it is an AI; never invents listing facts; hands off to a human.
- [ ] Test 10 real questions (hours of a listed business, how to claim, pricing, "is this free?", "stop contacting me"). Opt-out phrases must work.
- [ ] Outbound AI dialer stays OFF until a lawyer has approved the consent language and call rules.

## 6. SEO / AI search ("AEO")
- [ ] Unique `<title>` and meta description per listing, town and category page; clean URLs.
- [ ] `sitemap.xml` submitted in Google Search Console; `robots.txt` not blocking the site.
- [ ] LocalBusiness structured data (JSON-LD) on listing pages; validate with Google's Rich Results test.
- [ ] Core pages load fast on cellular; images sized and lazy-loaded.

## 7. Outreach (friendly, helpful, not salesy)
- [ ] Message scripts come from the Offline Sharks training (the owner follows Tom Gaddis / Nick Ponte). **Do not write scripts from scratch.** Export or paste them into the repo/Drive first.
- [ ] Start with the 50-business list in Drive ("VC Shine Outreach: 50 Ventura County Businesses"); update each row's status as contacted.
- [ ] Phone numbers are business lines; follow Do-Not-Call rules; email follows CAN-SPAM (identify sender, honest subject, unsubscribe, address).
- [ ] Owner approves the first batch before anything is sent.

## 8. Done means
All of sections 1-4 pass on a real phone, the owner has seen the live site and approved prices, a lawyer has seen the consent wording, and the first outreach batch is approved. Report each item as passed / failed / not run, with proof (URL or screenshot).
