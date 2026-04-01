import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'

export interface SobrietyStats {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  totalHours: number
}

export function getSobrietyStats(soberDate: Date): SobrietyStats {
  const now = new Date()
  const totalDays = differenceInDays(now, soberDate)
  const totalHours = differenceInHours(now, soberDate)

  // Breakdown
  const hours = differenceInHours(now, soberDate) % 24
  const minutes = differenceInMinutes(now, soberDate) % 60
  const seconds = differenceInSeconds(now, soberDate) % 60

  return {
    days: totalDays,
    hours,
    minutes,
    seconds,
    totalDays,
    totalHours,
  }
}

export const MILESTONE_DAYS = [1, 7, 14, 30, 60, 90, 180, 270, 365, 548, 730, 1825, 3650]

export function getEarnedMilestoneDays(totalDays: number): number[] {
  return MILESTONE_DAYS.filter((days) => totalDays >= days)
}

export function getNextMilestone(totalDays: number): number | null {
  const next = MILESTONE_DAYS.find((days) => days > totalDays)
  return next ?? null
}

export function getDaysUntilNextMilestone(totalDays: number): number | null {
  const next = getNextMilestone(totalDays)
  if (next === null) return null
  return next - totalDays
}

export function formatSobrietyMessage(days: number): string {
  if (days === 0) return 'Day 1 starts now. You are not alone.'
  if (days === 1) return 'One day. That is everything.'
  if (days < 7) return `${days} days. Keep going.`
  if (days === 7) return 'One week. Your body is healing.'
  if (days < 30) return `${days} days of strength.`
  if (days === 30) return 'One month. You are doing it.'
  if (days < 90) return `${days} days of freedom.`
  if (days === 90) return '90 days. A new life is here.'
  if (days < 365) return `${days} days of living sober.`
  if (days === 365) return 'One year. You are an inspiration.'
  const years = Math.floor(days / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} of living fully.`
}
