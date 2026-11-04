// Safety net for the AI companion. This is a deliberately over-sensitive keyword check,
// NOT a classifier: it exists so crisis resources are shown even if the model call fails.
// The model's own crisis protocol (see companion.ts) is the primary response.
//
// Ported from the original PWA (app-src/src/screens/SoberGuide.jsx), which matched plain
// substrings and so fired on ordinary words ("od" inside "good", "God", "nobody").
// These patterns use word boundaries.

const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicid(e|al)\b/i,
  /\bkill(ing)? (myself|me)\b/i,
  /\bwant(ed|s)? to die\b/i,
  /\bwish i (was|were) dead\b/i,
  /\bend (it all|my life|it)\b/i,
  /\btake my (own )?life\b/i,
  /\boverdos(e|ed|ing)\b/i,
  /\bod(['’]?d|ed|ing)?\b/i,
  /\b(harm|hurt|cut|cutting) (myself|me)\b/i,
  /\bself[- ]?harm\b/i,
  /\bnot worth living\b/i,
  /\bdon['’]?t want to (be here|live|be alive|wake up)\b/i,
  /\bno (reason|point) (to|in) (live|living|going on)\b/i,
]

export function isCrisisMessage(text: string): boolean {
  return CRISIS_PATTERNS.some((re) => re.test(text))
}

// Resource numbers come from the original PWA's system prompt (988, Crisis Text Line 741741,
// 911, SAMHSA 1-800-662-4357). VERIFY each before launch; they are not independently checked.
export const CRISIS_RESOURCES_TEXT = [
  "I hear you, and I'm concerned about your safety. Please reach out right now:",
  '• 988 Suicide & Crisis Lifeline: call or text 988',
  '• Crisis Text Line: text HOME to 741741',
  '• Emergency: call 911',
  'You are not alone. These trained counselors are available 24/7 and want to help.',
].join('\n')
