'use client'

import { useEffect, useState } from 'react'
import { MilestoneCelebration } from './milestone-celebration'
import { usePushSubscription } from '@/lib/use-push-subscription'

interface MilestoneInfo {
  emoji: string
  label: string
  description: string
  days: number
}

export function MilestoneChecker() {
  const [queue, setQueue] = useState<MilestoneInfo[]>([])
  const [checked, setChecked] = useState(false)

  usePushSubscription()

  useEffect(() => {
    fetch('/api/milestones', { method: 'POST' })
      .then((r) => r.json())
      .then((data) => {
        if (data.uncelebrated?.length > 0) {
          const milestones: MilestoneInfo[] = data.uncelebrated.map(
            (um: { milestone: MilestoneInfo }) => um.milestone
          )
          setQueue(milestones)
          // Show browser notification for the first uncelebrated milestone
          if ('Notification' in window && Notification.permission === 'granted') {
            const m = milestones[0]
            new Notification(`🎉 ${m.label}!`, {
              body: `You've reached ${m.days} days sober. Keep going — you're incredible!`,
            })
          } else if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                const m = milestones[0]
                new Notification(`🎉 ${m.label}!`, {
                  body: `You've reached ${m.days} days sober. Keep going — you're incredible!`,
                })
              }
            })
          }
        }
        setChecked(true)
      })
      .catch(() => setChecked(true))
  }, [])

  function handleClose() {
    const next = queue.slice(1)
    setQueue(next)
    if (next.length === 0) {
      fetch('/api/milestones', { method: 'PATCH' }).catch(() => {})
    }
  }

  if (!checked || queue.length === 0) return null

  return <MilestoneCelebration milestone={queue[0]} onClose={handleClose} />
}
