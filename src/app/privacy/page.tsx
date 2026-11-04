import { LegalPage } from '@/components/legal/legal-page'

export const metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Effective: [date]. Operated by: [legal entity name and address]. Contact: [privacy email].</p>
      <p>
        Information about your recovery is sensitive. This page explains what JustStaySober collects,
        why, and your choices. It describes the app as it works today.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account:</strong> your email address, and the name and profile picture from Google if you sign in with Google. You can add a short bio.</li>
        <li><strong>Recovery information you enter:</strong> your sobriety date and the substance you choose, daily mood check-ins and notes, journal entries, and milestones you reach.</li>
        <li><strong>Community activity:</strong> posts, comments and likes (including whether a post was made anonymously), plus reports you send and people you block.</li>
        <li><strong>Notifications:</strong> if you turn on push notifications, the address your browser gives us so we can send them.</li>
        <li><strong>Sign-in cookies:</strong> a session cookie that keeps you signed in, and security cookies used by the sign-in system.</li>
        <li><strong>AI companion (Sober Guide):</strong> the messages you send to it, see below.</li>
      </ul>
      <p>The current version of the app does not use advertising or analytics tools. [Owner: confirm before launch; the older landing page and PWA are separate and may differ.]</p>

      <h2>How we use it</h2>
      <ul>
        <li>To run the app: show your counter, milestones and journal, and send notifications you asked for.</li>
        <li>To keep the community safe: review reports and act on posts that break the guidelines.</li>
        <li>To sign you in and protect your account.</li>
      </ul>
      <p>We do not sell your information. [Lawyer: confirm wording against state privacy and health-data laws.]</p>

      <h2>Who can see what</h2>
      <ul>
        <li><strong>Journal and check-ins:</strong> private to you. [Owner: confirm no admin tool exposes them.]</li>
        <li><strong>Community posts:</strong> visible to other signed-in members. Anonymous posts show no name to other members.</li>
        <li><strong>Moderators:</strong> can see reported content and the author&apos;s email address, including for anonymous posts, so they can act on a report.</li>
        <li><strong>Other members you block</strong> will no longer see your posts, and you will no longer see theirs.</li>
      </ul>

      <h2>AI companion</h2>
      <p>
        When you use the Sober Guide, your messages are sent to Anthropic, which provides the AI model,
        to generate a reply. We do not save your conversation in our database and we do not write the
        text of your messages to our logs. Anthropic&apos;s own handling of data is described in its terms
        and privacy policy. [Owner/lawyer: link to Anthropic&apos;s current terms and confirm the retention
        setting on our account.] The Sober Guide is not a therapist or a medical professional, and it can
        make mistakes. In an emergency call 911; for a crisis call or text 988.
      </p>

      <h2>Services we use</h2>
      <ul>
        <li>Sign-in: Google (if you choose it) and an email service, [Resend], to send sign-in links.</li>
        <li>Hosting and database: [hosting provider and database provider, and where data is stored].</li>
        <li>AI model: Anthropic, as described above.</li>
      </ul>

      <h2>Your choices</h2>
      <ul>
        <li><strong>Delete your account:</strong> Profile → Delete my account. This permanently deletes your account and the data tied to it, including your sobriety date, journal, check-ins, milestones, posts, comments, likes and notification settings.</li>
        <li><strong>Delete a post or comment:</strong> use Delete on your own content.</li>
        <li><strong>Notifications:</strong> turn them off in your browser settings.</li>
        <li>[Lawyer: add access/correction/portability rights and how to request them. There is not yet a data-export feature.]</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        We keep your information while your account is open. When you delete your account it is removed
        from our database. [Owner/lawyer: state how long backups are kept.]
      </p>

      <h2>Security</h2>
      <p>
        We use a hosted database and encrypted connections. No system is perfectly secure. [Owner:
        confirm encryption at rest and describe it accurately before publishing; do not claim more than is true.]
      </p>

      <h2>Children</h2>
      <p>[Owner/lawyer: set the minimum age (for example 18+) and how it is enforced.]</p>

      <h2>Not a healthcare provider</h2>
      <p>
        JustStaySober is a self-help tool, not a healthcare provider. [Lawyer: confirm whether HIPAA or
        42 CFR Part 2 apply to any part of the service, and any state health-data laws.]
      </p>

      <h2>Changes and contact</h2>
      <p>If we change this policy we will update the date above and tell you in the app. Contact: [privacy email].</p>
    </LegalPage>
  )
}
