import Link from 'next/link'
import { LegalPage } from '@/components/legal/legal-page'

export const metadata = { title: 'Terms of Use' }

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <p>Effective: [date]. Operated by: [legal entity name and address]. Contact: [email].</p>

      <h2>Not medical or emergency care</h2>
      <p>
        JustStaySober is a self-help and community tool. It is not medical advice, treatment, therapy or
        crisis care, and it does not replace a doctor, counselor, sponsor or treatment program. The
        Sober Guide is an AI and can be wrong. <strong>In an emergency call 911. For a crisis call or text 988.</strong>
      </p>

      <h2>Who can use it</h2>
      <p>[Owner/lawyer: minimum age and eligibility.] You are responsible for keeping your account secure.</p>

      <h2>Your content</h2>
      <p>
        You own what you post. You give us permission to store and show it in the app as you choose
        (for example, to other members) and to review it for safety. You can delete your posts and
        comments, or your whole account, at any time. [Lawyer: confirm the license wording.]
      </p>

      <h2>Rules</h2>
      <p>
        You agree to follow the <Link href="/guidelines">Community Guidelines</Link>. We may hide content,
        suspend posting, or close accounts that break them or put others at risk. You may not try to
        break, overload or scrape the service, or use it to advertise or recruit for treatment services.
      </p>

      <h2>Third-party services and links</h2>
      <p>
        The app may point to meetings, hotlines and other resources run by others. We do not control
        them and cannot promise their information is complete or current. [Owner: confirm data-source
        terms for any meeting listings before launch.]
      </p>

      <h2>Cost</h2>
      <p>[Owner: the app is free. Describe any paid upgrade, price, renewal and refund terms here before charging anyone.]</p>

      <h2>Disclaimers and limits</h2>
      <p>
        The service is provided &quot;as is&quot; without promises that it will always be available or error
        free. [Lawyer: limitation of liability, indemnity, governing law and dispute terms.]
      </p>

      <h2>Changes</h2>
      <p>We may update these terms and will tell you in the app. Contact: [email].</p>
    </LegalPage>
  )
}
