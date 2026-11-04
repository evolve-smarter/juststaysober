import { isCrisisMessage } from '../src/lib/crisis'

const shouldFire = [
  'I want to kill myself', 'thinking about suicide', "I don't want to be here anymore", 'I took too much, I think I overdosed',
  'I want to die', 'i might OD tonight', 'I keep wanting to hurt myself', 'there is no point in going on', 'I want to end it all',
  'I wish I was dead', "i'm suicidal", 'thinking about self-harm',
]
const shouldNotFire = [
  'I had a good day', 'Thank God for my sponsor', 'nobody called me today', "I'm modest about my progress", 'I went to a meeting, it was good',
  'My code is hard to read', 'I have 30 days sober', 'I relapsed last night and I feel ashamed', 'cravings are bad today',
]

let failed = 0
for (const t of shouldFire) if (!isCrisisMessage(t)) { console.log('MISSED  :', t); failed++ }
for (const t of shouldNotFire) if (isCrisisMessage(t)) { console.log('FALSE+  :', t); failed++ }
console.log(failed ? `${failed} FAILED` : `all ${shouldFire.length + shouldNotFire.length} cases pass`)
process.exit(failed ? 1 : 0)
