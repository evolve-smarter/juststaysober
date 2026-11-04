// Simple in-memory sliding-window limiter. Per server instance only: replace with a shared
// store (e.g. the database) if the app runs on more than one instance.
const buckets = new Map<string, number[]>()

/** Returns true if the caller is OVER the limit (and does not record the attempt). */
export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= max) {
    buckets.set(key, recent)
    return true
  }
  recent.push(now)
  buckets.set(key, recent)
  return false
}
