import React from 'react'
import { formatMetric, formatCI } from '../../lib/nbi.js'
import { SECONDARY_METRICS } from './metrics-config.jsx'

// Secondary metric cards (DIR, AIR, ECR, EIR). Header, value, CI, and a
// one-line description. The formulas have moved to the Definitions tab's
// Formulae collapsible to keep these cards visually compact.
export default function SmallMetrics({ metrics }) {
  return (
    <div className="dash-small">
      {SECONDARY_METRICS.map(s => {
        const ci = formatCI(s.k, metrics[`${s.k}_CI`])
        return (
          <div key={s.k} className="dash-small-card">
            <div className="dash-small-expansion">{s.expansion}</div>
            <div className="dash-small-val">{formatMetric(s.k, metrics[s.k])}</div>
            <div className="dash-small-ci">{ci ? `95% CI ${ci}` : ''}</div>
            <div className="dash-small-desc">{s.desc}</div>
          </div>
        )
      })}
    </div>
  )
}
