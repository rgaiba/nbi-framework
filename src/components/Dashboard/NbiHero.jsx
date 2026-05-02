import React from 'react'
import { interpretMetric, formatCI } from '../../lib/nbi.js'

// NBI hero card. Big primary value, 95% CI, and a one-line interpretation.
// The formula now lives in the Definitions tab's Formulae collapsible.
export default function NbiHero({ metrics }) {
  const v = metrics.NBI
  const interp = interpretMetric('NBI', v)
  const cls = v === null ? '' : v > 0 ? 'val-pos' : v < 0 ? 'val-neg' : 'val-zero'
  const display = v === null ? 'n/a' : `${v > 0 ? '+' : ''}${v.toFixed(1)}%`
  const ci = formatCI('NBI', metrics.NBI_CI)

  return (
    <div className="dash-hero">
      <div className="dash-hero-label">Net beneficial influence</div>
      <div className={`dash-hero-val ${cls}`}>{display}</div>
      {ci && <div className="dash-hero-ci">95% CI {ci}</div>}
      <div className="dash-hero-interp">{interp}</div>
    </div>
  )
}
