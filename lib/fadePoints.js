export const FADE_RANKS = [
  { key: 'Member', threshold: 0 },
  { key: 'Stateer', threshold: 1000 },
  { key: 'Silver', threshold: 2000 },
  { key: 'Gold', threshold: 3000 },
  { key: 'Platinum', threshold: 4000 },
  { key: 'Diamond', threshold: 5000 },
]

export function getFadeRankIndex(totalSpent) {
  // 0..5 (Member..Diamond)
  // thresholds: 1000/2000/3000/4000/5000
  if (totalSpent >= 5000) return 5
  if (totalSpent >= 4000) return 4
  if (totalSpent >= 3000) return 3
  if (totalSpent >= 2000) return 2
  if (totalSpent >= 1000) return 1
  return 0
}

export function getPointsPer100ByRankIndex(rankIndex) {
  // Starting rankIndex=0 => 5 points per ₹100
  // After each rank-up => +5, so: 5,10,15,20,25,30 (for 6 ranks)
  return (rankIndex + 1) * 5
}

export function calcEarnedPointsBetweenBuckets({ prevTotalSpent, newTotalSpent, pointsCap }) {
  // Points are earned in fixed ₹100 buckets.
  // For each bucket, use the rank at that bucket boundary (k*100).
  const start = Math.max(0, prevTotalSpent)
  const end = Math.max(0, newTotalSpent)
  if (end <= start) return 0

  let points = 0

  // bucket boundaries are integers representing k*100.
  // We earn for bucket indexes k where (k*100) is within (start, end].
  const startK = Math.floor(start / 100)
  const endK = Math.floor(end / 100)

  for (let k = startK + 1; k <= endK; k++) {
    const boundarySpend = k * 100
    const rankIndex = getFadeRankIndex(boundarySpend)
    const per100 = getPointsPer100ByRankIndex(rankIndex)
    points += per100
    if (typeof pointsCap === 'number' && pointsCap >= 0 && points >= pointsCap) {
      return pointsCap
    }
  }

  return points
}

export function getMonthlyCapDefault() {
  // Monthly spending cap for earned points (max points per calendar month)
  // If you want to change it later, edit this constant.
  // Example policy: cap points earned per month to 5000.
  return 5000
}

export function getUTCMonthKey(date = new Date()) {
  // Month key in UTC: YYYY-MM
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export function calcMonthlyEarnedPointsCap({ prevMonthPoints, earnedNow, monthlyCap }) {
  const cap = typeof monthlyCap === 'number' ? monthlyCap : getMonthlyCapDefault()
  const already = Math.max(0, Number(prevMonthPoints || 0))
  const remaining = Math.max(0, cap - already)
  return Math.min(earnedNow, remaining)
}

