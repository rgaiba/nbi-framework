// =============================================================================
//  NBI FRAMEWORK — CORE MATH
// =============================================================================
//  Operationalized from the canonical Figure 1 (NBI_Central_Illustration.html).
//  Authored by Rahul Gaiba, MD. Version 1.0.
//
//  Definitions
//  -----------
//   D_i  = clinician's initial (independent) binary decision
//   A    = AI algorithm's binary output
//   D_f  = clinician's final binary decision after AI nudge (only recorded if D_i ≠ A)
//   R    = reference standard (e.g. coronary angiography truth)
//
//   Correct_i = 1 if D_i == R else 0
//   ΔD        = 1 if D_f != D_i else 0   (only meaningful on disagreement)
//   Disagreement = (D_i != A)            ← AI can only exert influence here
//
//  2×2 outcome matrix (only computed on disagreement cases)
//  --------------------------------------------------------
//        Correct_i = 0           Correct_i = 1
//   ΔD=1  B  (Wrong → Right)     H  (Right → Wrong)
//   ΔD=0  IR (Wrong → Wrong)     AR (Right → Right)
//
//  Five canonical metrics
//  ----------------------
//   N_disagree = B + H + AR + IR
//   NBI = (B − H) / N_disagree × 100      [primary outcome]
//   AIR = B / (B + H)                     [change quality]
//   ECR = B / (B + IR) × 100              [error correction rate]
//   EIR = H / (H + AR) × 100              [error induction rate]
//   DIR = (B + H) / N_disagree × 100      [overall decision change rate]
// =============================================================================

/**
 * Adjudicate a single case into one of the four NBI outcome classes (or 'agreement').
 *
 * All four inputs are binary: 0 / 1 (use 1 = "positive"/OMI, 0 = "negative"/Not OMI).
 * Returns one of: 'B' | 'H' | 'AR' | 'IR' | 'agreement'.
 *
 * @param {{Di:0|1, A:0|1, Df:0|1, R:0|1}} c
 * @returns {'B'|'H'|'AR'|'IR'|'agreement'}
 */
export function adjudicateCase({ Di, A, Df, R }) {
  // Coerce to 0/1 numbers
  const di = Number(Di) ? 1 : 0
  const a  = Number(A)  ? 1 : 0
  const df = Number(Df) ? 1 : 0
  const r  = Number(R)  ? 1 : 0

  if (di === a) return 'agreement'

  const correctI = di === r ? 1 : 0
  const deltaD   = df !== di ? 1 : 0

  if (correctI === 0 && deltaD === 1) return 'B'   // wrong → right
  if (correctI === 0 && deltaD === 0) return 'IR'  // wrong → wrong
  if (correctI === 1 && deltaD === 1) return 'H'   // right → wrong
  return 'AR'                                       // right → right
}

/**
 * Aggregate an array of per-case rows into B / H / AR / IR counts.
 * Cases that resolve to 'agreement' are excluded from N_disagree.
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
 * Compute the five NBI metrics from raw outcome counts.
 * Returns null for any metric whose denominator is 0 (we surface this in the UI rather
 * than silently coerce to 0 — division-by-zero has different meaning per metric).
 *
 * @param {{B:number, H:number, AR:number, IR:number}} counts
 * @returns {{
 *   B:number, H:number, AR:number, IR:number, Ndisagree:number,
 *   NBI:number|null, AIR:number|null, ECR:number|null, EIR:number|null, DIR:number|null
 * }}
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

  return {
    B: b, H: h, AR: ar, IR: ir,
    Ndisagree,
    NBI, AIR, ECR, EIR, DIR,
  }
}

/**
 * Human-friendly interpretation strings for each metric, given a current value.
 * Useful for the dashboard tooltips/captions.
 *
 * @param {string} metric  'NBI'|'AIR'|'ECR'|'EIR'|'DIR'
 * @param {number|null} value
 * @returns {string}
 */
export function interpretMetric(metric, value) {
  if (value === null || Number.isNaN(value)) return 'Not computable — denominator is zero.'

  switch (metric) {
    case 'NBI':
      if (value > 0) return 'Net clinical benefit attributable to AI on disagreement cases.'
      if (value < 0) return 'Net clinical harm attributable to AI on disagreement cases.'
      return 'No net effect — beneficial and harmful changes balance.'
    case 'AIR':
      if (value > 0.5) return 'Most AI-driven decision changes were beneficial.'
      if (value < 0.5) return 'Most AI-driven decision changes were harmful.'
      return 'Beneficial and harmful changes are balanced.'
    case 'ECR':
      if (value >= 75) return 'High error-correction rate — AI nudges successfully fix most clinician errors.'
      if (value >= 25) return 'Moderate error-correction rate — clinician sometimes resists correct AI.'
      return 'Low error-correction rate — likely algorithm aversion or low trust.'
    case 'EIR':
      if (value <= 5)  return 'Low error-induction — clinicians appropriately resist incorrect AI.'
      if (value <= 25) return 'Moderate error-induction — some automation bias on correct decisions.'
      return 'High error-induction — substantial automation bias detected.'
    case 'DIR':
      if (value >= 80) return 'Very high change rate — possible automation bias.'
      if (value <= 10) return 'Very low change rate — possible algorithm aversion.'
      return 'Moderate change rate on disagreement.'
    default:
      return ''
  }
}

/**
 * Format a metric value for display.
 * NBI/ECR/EIR/DIR are percentages; AIR is a proportion in [0, 1].
 *
 * @param {string} metric
 * @param {number|null} value
 * @returns {string}
 */
export function formatMetric(metric, value) {
  if (value === null || Number.isNaN(value)) return '—'
  if (metric === 'AIR') return value.toFixed(3)
  // percentage metrics
  return `${value.toFixed(1)}%`
}

// Tiny self-test — run via:  node -e "import('./src/lib/nbi.js').then(m => m._selfTest && m._selfTest())"
export function _selfTest() {
  const cases = [
    { Di: 0, A: 1, Df: 1, R: 1 }, // B (wrong→right)
    { Di: 0, A: 1, Df: 1, R: 1 }, // B
    { Di: 1, A: 0, Df: 0, R: 1 }, // H (right→wrong)
    { Di: 0, A: 1, Df: 0, R: 1 }, // IR (wrong→wrong)
    { Di: 1, A: 0, Df: 1, R: 1 }, // AR (right→right)
    { Di: 1, A: 1, Df: 1, R: 1 }, // agreement
  ]
  const agg = aggregateCases(cases)
  const m = computeMetrics(agg)
  console.log('agg', agg, 'metrics', m)
  // Expected: B=2, H=1, IR=1, AR=1, agreement=1; NBI = (2-1)/5*100 = 20
  console.assert(agg.B === 2 && agg.H === 1 && agg.IR === 1 && agg.AR === 1 && agg.agreement === 1, 'agg counts')
  console.assert(Math.abs(m.NBI - 20) < 1e-9, 'NBI')
  console.assert(Math.abs(m.AIR - 2/3) < 1e-9, 'AIR')
  console.assert(Math.abs(m.ECR - 200/3) < 1e-9, 'ECR')
  console.assert(Math.abs(m.EIR - 50) < 1e-9, 'EIR')
  console.assert(Math.abs(m.DIR - 60) < 1e-9, 'DIR')
  return true
}
