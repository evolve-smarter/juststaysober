import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed milestones
  const milestones = [
    { days: 1, label: '24 Hours', emoji: '🌟', description: 'One day at a time — you made it through day one.', badgeColor: '#f59e0b' },
    { days: 7, label: '1 Week', emoji: '🔥', description: 'One full week of strength.', badgeColor: '#f97316' },
    { days: 14, label: '2 Weeks', emoji: '💪', description: 'Two weeks — your body is already healing.', badgeColor: '#10b981' },
    { days: 30, label: '30 Days', emoji: '🏅', description: 'One month. The hardest stretch is behind you.', badgeColor: '#3b82f6' },
    { days: 60, label: '60 Days', emoji: '✨', description: 'Two months of choosing yourself every day.', badgeColor: '#8b5cf6' },
    { days: 90, label: '90 Days', emoji: '🎯', description: 'Three months — a new way of life is taking hold.', badgeColor: '#ec4899' },
    { days: 180, label: '6 Months', emoji: '🌈', description: 'Six months of transformation.', badgeColor: '#06b6d4' },
    { days: 270, label: '9 Months', emoji: '🦋', description: 'Nine months — you are reborn.', badgeColor: '#84cc16' },
    { days: 365, label: '1 Year', emoji: '🏆', description: 'One year. An entire year of courage and grace.', badgeColor: '#f59e0b' },
    { days: 548, label: '18 Months', emoji: '🌺', description: 'A year and a half of living fully.', badgeColor: '#f97316' },
    { days: 730, label: '2 Years', emoji: '💎', description: 'Two years. You are an inspiration.', badgeColor: '#6366f1' },
    { days: 1825, label: '5 Years', emoji: '👑', description: 'Five years — a life completely transformed.', badgeColor: '#a855f7' },
    { days: 3650, label: '10 Years', emoji: '🌟', description: 'Ten years of sober living. Legendary.', badgeColor: '#f59e0b' },
  ]

  for (const milestone of milestones) {
    await prisma.milestone.upsert({
      where: { days: milestone.days },
      update: milestone,
      create: milestone,
    })
  }

  // Seed resources
  const resources = [
    {
      name: 'SAMHSA National Helpline',
      type: 'hotline',
      description: 'Free, confidential, 24/7 treatment referral and information service for individuals and families facing mental and/or substance use disorders.',
      phone: '1-800-662-4357',
      url: 'https://www.samhsa.gov/find-help/national-helpline',
      isVerified: true,
    },
    {
      name: 'Alcoholics Anonymous',
      type: 'meeting',
      description: 'International mutual aid fellowship with meetings worldwide for people who want to stop drinking.',
      url: 'https://www.aa.org',
      isVerified: true,
    },
    {
      name: 'Narcotics Anonymous',
      type: 'meeting',
      description: 'Global community-based organization providing a recovery process for people affected by addiction.',
      url: 'https://www.na.org',
      isVerified: true,
    },
    {
      name: 'SMART Recovery',
      type: 'meeting',
      description: 'Science-based addiction recovery support groups, both online and in-person.',
      url: 'https://www.smartrecovery.org',
      isVerified: true,
    },
    {
      name: 'Crisis Text Line',
      type: 'hotline',
      description: 'Text HOME to 741741 to connect with a trained Crisis Counselor.',
      phone: 'Text HOME to 741741',
      url: 'https://www.crisistextline.org',
      isVerified: true,
    },
    {
      name: 'Summit Malibu',
      type: 'treatment_center',
      description: 'Luxury addiction treatment center in Malibu, CA specializing in evidence-based recovery programs.',
      url: 'https://www.summitmalibu.com',
      city: 'Malibu',
      state: 'CA',
      isVerified: true,
    },
  ]

  for (const resource of resources) {
    await prisma.resource.upsert({
      where: { id: resource.name.toLowerCase().replace(/\s+/g, '-') },
      update: resource,
      create: { id: resource.name.toLowerCase().replace(/\s+/g, '-'), ...resource },
    })
  }

  console.log('✅ Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
