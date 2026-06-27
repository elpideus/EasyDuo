// Hand evaluation
export function handStrength(a, ca, b, cb) {
  if (!a || !b) return null
  a = +a; b = +b
  const rA = ca === 'R', rB = cb === 'R'
  const bothRed = rA && rB
  const lo = Math.min(a, b), hi = Math.max(a, b)

  if (bothRed) {
    if (lo === 3 && hi === 8) return { rank: 10000, tier: 'top', descKey: 'primePair' }
    if (lo === 4 && hi === 7) return { rank: 9500, tier: 'top', descKey: 'executor' }
    if (lo === 1 && hi === 8) return { rank: 9400, tier: 'top', descKey: 'superiorPair18' }
    if (lo === 1 && hi === 3) return { rank: 9300, tier: 'top', descKey: 'superiorPair13' }
    if (lo === 4 && hi === 9) return { rank: 8850, tier: 'high', descKey: 'highWarden' }
  }

  if (a === 10 && b === 10) return { rank: 9000, tier: 'top', descKey: 'tenPair' }
  if (lo === 3 && hi === 7) return { rank: 8950, tier: 'top', descKey: 'judge' }

  if (a === b) {
    const t = a >= 8 ? 'top' : a >= 6 ? 'high' : a >= 4 ? 'mid' : 'low'
    return { rank: 8000 + a * 100, tier: t, descKey: 'pairOf', descParams: { n: a } }
  }

  if (lo === 4 && hi === 9) return { rank: 7850, tier: 'mid', descKey: 'warden' }
  if (lo === 1 && hi === 2) return { rank: 7800, tier: 'mid', descKey: 'oneTwo' }
  if (lo === 1 && hi === 4) return { rank: 7600, tier: 'mid', descKey: 'oneFour' }
  if (lo === 1 && hi === 9) return { rank: 7400, tier: 'mid', descKey: 'oneNine' }
  if (lo === 1 && hi === 10) return { rank: 7200, tier: 'mid', descKey: 'oneTen' }
  if (lo === 4 && hi === 10) return { rank: 7000, tier: 'mid', descKey: 'fourTen' }
  if (lo === 4 && hi === 6) return { rank: 6800, tier: 'mid', descKey: 'fourSix' }

  const sum = (a + b) % 10
  if (sum === 9) return { rank: 890, tier: 'high', descKey: 'perfectNine' }
  if (sum === 0) return { rank: 0, tier: 'low', descKey: 'bust' }
  return { rank: sum * 10, tier: sum >= 7 ? 'high' : sum >= 4 ? 'mid' : 'low', descKey: 'points', descParams: { n: sum } }
}

function compareHands(h1, h2) {
  if (!h1 && !h2) return 0
  if (!h1) return -1
  if (!h2) return 1
  return h1.rank > h2.rank ? 1 : h1.rank < h2.rank ? -1 : 0
}

const VALS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const COLRS = ['R', 'Y']

export function calcProb(myHand, activeOpps) {
  if (!myHand) return null
  if (!activeOpps.length) return { win: 1, tie: 0, lose: 0 }

  let wins = 0, ties = 0, total = 0

  function enumerate(idx, oppHands) {
    if (idx === activeOpps.length) {
      total++
      let beatAll = true, winAll = true
      for (const oh of oppHands) {
        const c = compareHands(myHand, oh)
        if (c < 0) { beatAll = false; winAll = false; break }
        if (c === 0) winAll = false
      }
      if (winAll) wins++
      else if (beatAll) ties++
      return
    }
    const o = activeOpps[idx]
    if (o.visible && o.visColor) {
      for (const v of VALS) for (const c of COLRS) {
        enumerate(idx + 1, [...oppHands, handStrength(o.visible, o.visColor, v, c)])
      }
    } else {
      for (const v1 of VALS) for (const c1 of COLRS)
        for (const v2 of VALS) for (const c2 of COLRS) {
          enumerate(idx + 1, [...oppHands, handStrength(v1, c1, v2, c2)])
        }
    }
  }

  enumerate(0, [])
  return { win: wins / total, tie: ties / total, lose: (total - wins - ties) / total }
}

const AGG_W = { Fold: -1, Check: 0, Call: 0.3, 'Half Pot': 0.6, Raise: 0.8, 'All In': 1.0 }

export function aggression(acts) {
  if (!acts.length) return 0.5
  const s = acts.reduce((acc, a) => acc + (AGG_W[a.action] ?? 0), 0)
  return Math.min(1, Math.max(0, 0.5 + s / (acts.length * 2)))
}

export function decide(myHand, opponents, log) {
  if (!myHand) return { action: '—', conf: 0, prob: null, explKey: 'noSticks', explParams: {} }

  const foldedSet = new Set(log.filter(e => e.action === 'Fold').map(e => e.who))
  const activeOpps = opponents.filter(o => !foldedSet.has(o.id))

  if (!activeOpps.length) return {
    action: 'WIN', conf: 1, prob: { win: 1, tie: 0, lose: 0 },
    explKey: 'allFolded', explParams: {}
  }

  const prob = calcProb(myHand, activeOpps)
  if (!prob) return { action: '—', conf: 0, prob: null, explKey: 'cantCalc', explParams: {} }

  const oppLog = log.filter(e => e.who !== 'me')
  const agg = aggression(oppLog)
  const baseEW = prob.win + prob.tie * 0.4
  const penalty = (agg - 0.5) * 0.25
  const ew = Math.max(0, Math.min(1, baseEW - penalty))

  const lastOpp = oppLog.length ? oppLog[oppLog.length - 1].action : null
  const facingBet = ['Raise', 'All In', 'Half Pot'].includes(lastOpp)
  const facingAllIn = lastOpp === 'All In'

  const aggKey = agg > 0.72 ? 'highlyAggressive' : agg > 0.55 ? 'aggressive' : agg < 0.3 ? 'passive' : 'neutral'

  let action, explKey

  if (ew >= 0.78) {
    action = 'ALL IN'
    explKey = 'strongEdge'
  } else if (ew >= 0.60) {
    action = facingAllIn ? (ew >= 0.70 ? 'CALL' : 'FOLD') : facingBet ? 'CALL' : 'RAISE'
    explKey = facingAllIn ? (ew >= 0.70 ? 'goodFacingAllIn' : 'goodFacingAllInFold') : facingBet ? 'goodFacing' : 'goodFree'
  } else if (ew >= 0.45) {
    action = facingAllIn ? 'FOLD' : facingBet ? 'CALL' : 'HALF POT'
    explKey = facingAllIn ? 'medFacingAllIn' : facingBet ? 'medFacing' : 'medFree'
  } else if (ew >= 0.30) {
    action = facingBet ? 'FOLD' : 'CHECK'
    explKey = facingBet ? 'weakFacing' : 'weakFree'
  } else {
    action = facingBet ? 'FOLD' : 'CHECK'
    explKey = facingBet ? 'veryWeakFacing' : 'veryWeakFree'
  }

  return {
    action, conf: ew, prob, explKey,
    explParams: {
      handDescKey: myHand.descKey,
      handDescParams: myHand.descParams || {},
      win: pct(prob.win),
      aggKey,
      oppActions: oppLog.map(e => e.action).join(', '),
      hasOppLog: oppLog.length > 0,
    },
  }
}

export function pct(v) { return Math.round((v || 0) * 100) + '%' }

export const ACTION_COLORS = {
  'ALL IN': 'text-red-400',
  'RAISE': 'text-orange-400',
  'HALF POT': 'text-yellow-400',
  'CALL': 'text-green-400',
  'CHECK': 'text-blue-400',
  'FOLD': 'text-zinc-500',
  '—': 'text-zinc-600',
  'WIN': 'text-yellow-300',
}

export const TIER_STYLES = {
  top: 'bg-amber-900/60 text-yellow-300 border border-yellow-600/40',
  high: 'bg-green-900/60 text-green-300 border border-green-600/40',
  mid: 'bg-yellow-900/40 text-yellow-200 border border-yellow-700/40',
  low: 'bg-red-900/40 text-red-300 border border-red-700/40',
}
