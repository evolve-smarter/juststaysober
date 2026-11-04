import { LegalPage } from '@/components/legal/legal-page'

export const metadata = { title: 'Community Guidelines' }

export default function GuidelinesPage() {
  return (
    <LegalPage title="Community Guidelines">
      <p>
        The JustStaySober community exists so people in recovery, and the people who love them, can
        support each other. These guidelines keep it safe. [Owner: please review and edit these.]
      </p>

      <h2>What we ask of everyone</h2>
      <ul>
        <li>Be kind. No harassment, shaming, threats or hate toward anyone.</li>
        <li>Respect every path to recovery. Do not put down someone else&apos;s approach.</li>
        <li>Respect privacy. Do not share another person&apos;s personal information or screenshots of their posts.</li>
      </ul>

      <h2>What is not allowed</h2>
      <ul>
        <li>Selling, advertising or recruiting for treatment programs, facilities, products or services, including referral or &quot;lead&quot; offers.</li>
        <li>Medical advice, including about withdrawal, detox or medications. Please ask a doctor.</li>
        <li>Sharing where or how to get alcohol or drugs, or encouraging anyone to use.</li>
        <li>Spam, scams, or sexual content.</li>
      </ul>

      <h2>If someone may be in danger</h2>
      <p>
        If you think someone is in immediate danger, call 911. For a crisis, call or text 988 (the
        988 Suicide &amp; Crisis Lifeline). You can also use <em>Report</em> and choose &quot;Someone may be in
        danger&quot;; reports like this are reviewed first. [Owner/lawyer: confirm how quickly these can be reviewed and say so honestly here.]
      </p>

      <h2>Reporting and blocking</h2>
      <ul>
        <li><strong>Report</strong> a post or comment that breaks these guidelines. Reviewers can hide it, restore it, or suspend the author from posting.</li>
        <li>When several different people report the same item, it is hidden automatically until someone reviews it. A report about someone in danger is not hidden automatically, so a person reaching out is not cut off.</li>
        <li><strong>Block</strong> someone to stop seeing their posts and comments. They are not told, and it works on anonymous posts without revealing who wrote them.</li>
      </ul>

      <h2>Anonymous posts</h2>
      <p>
        Other members cannot see who wrote an anonymous post. Our moderators can see the author&apos;s
        account if they need to act on a report. See the Privacy Policy.
      </p>
    </LegalPage>
  )
}
