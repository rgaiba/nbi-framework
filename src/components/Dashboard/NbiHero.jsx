import React from 'react'
import Chip from '../shared/Chip.jsx'
import Fraction from '../shared/Fraction.jsx'
import { interpretMetric, formatCI } from '../../lib/nbi.js'

export default function NbiHero({ metrics }) {
  const v = metrics.NBI
  const interp = interpretMetric('NBI', v)
  const cls = v === null ? '' : v > 0 ? 'val-pos' : v < 0 ? 'val-neg' : 'val-zero'
  const display = v === null ? 'n/a' : `${v > 0 ? '+' : ''}${v.toFixed(1)}%`
  const ci = formatCI('NBI', metrics.NBI_CI)

  return (
    <div className="dash-hero">
      <div className="dash-hero-label">Net beneficial influence</div>
      <div className="dash-hero-body">
        <div className="dash-hero-left">
          <div className={`dash-hero-val ${cls}`}>{display}</div>
          {ci && <div className="dash-hero-ci">95% CI {ci}</div>}
        </div>
        <div className="dash-hero-right">
          <Fraction
            num={<><Chip k="B" /> − <Chip k="H" /></>}
            den={<>N<sub>disagree</sub></>}
            mult="× 100"
          />
        </div>
      </div>
      <div className="dash-hero-interp">{interp}</div>
    </div>
  )
}
