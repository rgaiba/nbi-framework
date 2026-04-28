// =============================================================================
//  NBI FRAMEWORK . CORE MATH
// =============================================================================
//  Operationalized from the canonical Figure 1 (NBI_Central_Illustration.html).
//  Authored by Rahul Gaiba, MD. Version 1.0.
//
//  Definitions
//   D_i  = clinician's initial (independent) binary decision
//   A    = AI algorithm's binary output
//   D_f  = clinician's final binary decision after AI nudge (only on disagreement)
//   R    = reference standard (e.g. coronary angiography truth)
//
//   Correct_i = 1 if D_i == R else 0
//   ΔD        = 1 if D_f != D_i else 0   (only meaningful on disagreement)
//   Disagreement = (D_i != A)            ← AI can only exert influence here
//
//  2×2 outcome matrix (only computed on disagreement cases)
//        Correct_i = 0           Correct_i = 1
//   ΔD=1  B  (Wrong → Right)     H  (Right → Wrong)
//   ΔD=0  IR (Wrong → Wrong)     AR (Right → Right)
//
//  Five canonical metrics
//   N_disagree = B + H + AR + IR
//   NBI = (B − H) / N_disagree × 100      [primary outcome]
//   AIR = B / (B + H)                     [change quality]
//   ECR = B / (B + IR) × 100              [error correction rate]
//   EIR = H / (H + AR) × 100              [error induction rate]
//   DIR = (B + H) / N_disagree × 100      [overall decision change rate]
// =============================================================================

const Z_95 = 1.959964 // two-sided 95% z

/**
 * Adjudicate a single case into one of the four NBI outcome classes (or 'agreement').
 *
 * @param {{Di:0|1, A:0|1, Df:0|1, R:0|1}} c
 * @returns {'B'|'H'|'AR'|'IR'|'agreement'}
 */
export function adjudicateCase({ Di, A, Df, R }) {
  const di = Number(Di) ? 1 : 0
  const a  = Number(A)  ? 1 : 0
  const df = Number(Df) ? 1 : 0
  const r  = Number(R)  ? 1 : 0

  if (di === a) return 'agreement'

  const correctI = di === r ? 1 : 0
  const deltaD   = df !== di ? 1 : 0

  if (correctI === 0 && deltaD === 1) return 'B'
  if (correctI === 0 && deltaD === 0) return 'IR'
  if (correctI === 1 && deltaD === 1) return 'H'
  return 'AR'
}

/**
 * Aggregate per-case rows into B / H / AR / IR counts.
 *
 * @param {Array<{Di:0|1, A:0|1, Df:0|1, R:0|1}>} cases
 * @returns {{B:number, H:number, AR:number, IR:number, agreement:number, total:number}}
 */
export function aggregateCases(cases) {
  const counts = { B: 0, H: 0, AR: 0, IR: 0, agreement: 0 }
  for (const c of cases) {
    const cls = adjudicateCase(c)
    counts[cls] += 1
  }
  return { ...counts, total: cases.length }
}

/**
 * Wilson score 95% CI for a proportion (numerator/denominator).
 * More accurate than Wald, especially at small N or extreme p.
 * Returns proportions in [0, 1] or null if denominator is 0.
 *
 * @returns {{lo:number, hi:number}|null}
 */
export function wilsonCI(numerator, denominator) {
  const n = denominator
  if (!n || n <= 0) return null
  const p = numerator / n
  const z = Z_95
  const z2 = z * z
  const denom = 1 + z2 / n
  const center = (p + z2 / (2 * n)) / denom
  const half = (z * Math.sqrt(p * (1 - p) / n + z2 / (4 * n * n))) / denom
  return { lo: Math.max(0, center - half), hi: Math.min(1, center + half) }
}

/**
 * 95% CI for the NBI statistic, treated as the difference of two multinomial
 * proportions on the same sample: (B/N) - (H/N).
 *
 * Variance under multinomial:
 *   Var(p_B - p_H) = (p_B + p_H - (p_B - p_H)²) / N
 *
 * Returns endpoints as percentages (e.g. -3.4 to 12.7) clipped to [-100, 100],
 * or null if N is zero.
 *
 * @returns {{lo:number, hi:number}|null}
 */
export function nbiCI(B, H, N) {
  if (!N || N <= 0) return null
  const pB = B / N
  const pH = H / N
  const diff = pB - pH
  const variance = (pB + pH - diff * diff) / N
  const se = Math.sqrt(Math.max(0, variance))
  const half = Z_95 * se
  return {
    lo: Math.max(-1, diff - half) * 100,
    hi: Math.min(1, diff + half) * 100,
  }
}

/**
 * Compute the five NBI metrics plus 95% CIs for each.
 *
 * @param {{B:number, H:number, AR:number, IR:number}} counts
 */
export function computeMetrics({ B = 0, H = 0, AR = 0, IR = 0 } = {}) {
  const b  = Math.max(0, Number(B)  || 0)
  const h  = Math.max(0, Number(H)  || 0)
  const ar = Math.max(0, Number(AR) || 0)
  const ir = Math.max(0, Number(IR) || 0)

  const Ndisagree = b + h + ar + ir

  const NBI = Ndisagree > 0 ? ((b - h) / Ndisagree) * 100 : null
  const AIR = b + h > 0 ? b / (b + h) : null
  const ECR = b + ir > 0 ? (b / (b + ir)) * 100 : null
  const EIR = h + ar > 0 ? (h / (h + ar)) * 100 : null
  const DIR = Ndisagree > 0 ? ((b + h) / Ndisagree) * 100 : null

  // Wilson CI returns proportions in [0,1]; multiply by 100 for percentage metrics.
  const airCI = wilsonCI(b, b + h)
  const ecrCIp = wilsonCI(b, b + ir)
  const eirCIp = wilsonCI(h, h + ar)
  const dirCIp = wilsonCI(b + h, Ndisagree)

  return {
    B: b, H: h, AR: ar, IR: ir,
    Ndisagree,
    NBI, AIR, ECR, EIR, DIR,
    NBI_CI: nbiCI(b, h, Ndisagree),
    AIR_CI: airCI,
    ECR_CI: ecrCIp ? { lo: ecrCIp.lo * 100, hi: ecrCIp.hi * 100 } : null,
    EIR_CI: eirCIp ? { lo: eirCIp.lo * 100, hi: eirCIp.hi * 100 } : null,
    DIR_CI: dirCIp ? { lo: dirCIp.lo * 100, hi: dirCIp.hi * 100 } : null,
  }
}

/**
 * Human-friendly interpretation strings (no em dashes per design rule).
 */
export function interpretMetric(metric, value) {
  if (value === null || Number.isNaN(value)) return 'Not computable. Denominator is zero.'

  switch (metric) {
    case 'NBI':
      if (value > 0) return 'Net clinical benefit attributable to AI on disagreement cases.'
      if (value < 0) return 'Net clinical harm attributable to AI on disagreement cases.'
      return 'No net effect. Beneficial and harmful changes balance.'
    case 'AIR':
      if (value > 0.5) return 'Most AI-driven decision changes were beneficial.'
      if (value < 0.5) return 'Most AI-driven decision changes were harmful.'
      return 'Beneficial and harmful changes are balanced.'
    case 'ECR':
      if (value >= 75) return 'High error correction. AI nudges fix most clinician errors.'
      if (value >= 25) return 'Moderate error correction. Some correct AI flags resisted.'
      return 'Low error correction. Likely algorithm aversion.'
    case 'EIR':
      if (value <= 5)  return 'Low error induction. Clinicians appropriately resist incorrect AI.'
      if (value <= 25) return 'Moderate error induction. Some automation bias.'
      return 'High error induction. Substantial automation bias.'
    case 'DIR':
      if (value >= 80) return 'Very high change rate. Possible automation bias.'
      if (value <= 10) return 'Very low change rate. Possible algorithm aversion.'
      return 'Moderate change rate on disagreement.'
    default:
      return ''
  }
}

/** Format a metric value for display. */
export function formatMetric(metric, value) {
  if (value === null || Number.isNaN(value)) return 'n/a'
  if (metric === 'AIR') return value.toFixed(3)
  return `${value.toFixed(1)}%`
}

/** Format a CI tuple {lo, hi} for compact display under a metric value. */
export function formatCI(metric, ci) {
  if (!ci) return ''
  if (metric === 'AIR') {
    // AIR is on 0–1 scale; CI tuple is already on that scale.
    return `(${ci.lo.toFixed(2)}, ${ci.hi.toFixed(2)})`
  }
  // Percentage metrics; CI tuple is in percentage points.
  const sign = (n) => (n > 0 ? '+' : '') + n.toFixed(1)
  if (metric === 'NBI') return `(${sign(ci.lo)} to ${sign(ci.hi)})`
  return `(${ci.lo.toFixed(1)} to ${ci.hi.toFixed(1)})`
}

// Self-test harness, kept for regression checks.
export function _selfTest() {
  const cases = [
    { Di: 0, A: 1, Df: 1, R: 1 },
    { Di: 0, A: 1, Df: 1, R: 1 },
    { Di: 1, A: 0, Df: 0, R: 1 },
    { Di: 0, A: 1, Df: 0, R: 1 },
    { Di: 1, A: 0, Df: 1, R: 1 },
    { Di: 1, A: 1, Df: 1, R: 1 },
  ]
  const agg = aggregateCases(cases)
  const m = computeMetrics(agg)
  console.log('agg', agg, 'metrics', m)
  console.assert(agg.B === 2 && agg.H === 1 && agg.IR === 1 && agg.AR === 1 && agg.agreement === 1, 'agg counts')
  console.assert(Math.abs(m.NBI - 20) < 1e-9, 'NBI')
  console.assert(Math.abs(m.AIR - 2/3) < 1e-9, 'AIR')
  console.assert(m.NBI_CI !== null && m.AIR_CI !== null, 'CIs computed')
  return true
}
