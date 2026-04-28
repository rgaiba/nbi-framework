import React from 'react'
import { interpretMetric, formatMetric } from '../../lib/nbi.js'

const CARDS = [
  {
    key: 'NBI',
    name: 'Net Beneficial Influence',
    role: 'Primary metric',
    formulaJsx: <>(<span className="var-b">B</span> − <span className="var-h">H</span>) / N<sub>disagree</sub> × 100</>,
    accent: 'navy',
  },
  {
    key: 'AIR',
    name: 'Appropriate Influence Ratio',
    role: 'Change quality',
    formulaJsx: <><span className="var-b">B</span> / (<span className="var-b">B</span> + <span className="var-h">H</span>)</>,
    accent: 'amber',
  },
  {
    key: 'ECR',
    name: 'Error Correction Rate',
    role: 'Errors corrected by AI',
    formulaJsx: <><span className="var-b">B</span> / (<span className="var-b">B</span> + <span className="var-ir">IR</span>) × 100</>,
    accent: 'green',
  },
  {
    key: 'EIR',
    name: 'Error Induction Rate',
    role: 'Errors induced by AI',
    formulaJsx: <><span className="var-h">H</span> / (<span className="var-h">H</span> + <span className="var-ar">AR</span>) × 100</>,
    accent: 'red',
  },
  {
    key: 'DIR',
    name: 'Decision Influence Rate',
    role: 'Overall change rate',
    formulaJsx: <>(<span className="var-b">B</span> + <span className="var-h">H</span>) / N<sub>disagree</sub> × 100</>,
    accent: 'purple',
  },
]

export default function MetricCards({ metrics }) {
  return (
    <div className="metric-cards">
      {CARDS.map(c => {
        const v = metrics[c.key]
        const valStr = formatMetric(c.key, v)
        const interp = interpretMetric(c.key, v)

        let valClass = 'mc-val'
        if (c.key === 'NBI') {
          if (v > 0) valClass += ' mc-val-pos'
          else if (v < 0) valClass += ' mc-val-neg'
          else if (v === 0) valClass += ' mc-val-zero'
        }

        return (
          <div key={c.key} className={`metric-card mc-${c.accent}`}>
            <div className="mc-accent" />
            <div className="mc-head">
              <div className="mc-abbr">{c.key}</div>
              <div className="mc-name">{c.name}</div>
              <div className="mc-role muted">{c.role}</div>
            </div>
            <div className={valClass}>{valStr}</div>
            <code className="formula mc-formula">{c.formulaJsx}</code>
            <div className="mc-interp">{interp}</div>
          </div>
        )
      })}
      <div className="metric-card mc-summary">
        <div className="mc-summary-row">
          <span className="muted">N<sub>disagree</sub></span>
          <strong>{metrics.Ndisagree}</strong>
        </div>
        <div className="mc-summary-row mc-summary-mini">
          <div><span className="mini-k">B</span><span>{metrics.B}</span></div>
          <div><span className="mini-k">H</span><span>{metrics.H}</span></div>
          <div><span className="mini-k">IR</span><span>{metrics.IR}</span></div>
          <div><span className="mini-k">AR</span><span>{metrics.AR}</span></div>
        </div>
        <div className="mc-summary-foot muted">
          NBI is calculated only on disagreement cases. Agreement cases are excluded from all metrics.
        </div>
      </div>
    </div>
  )
}
