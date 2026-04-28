import React from 'react'
import { interpretMetric, formatMetric, formatCI } from '../../lib/nbi.js'

// Compact dashboard. Single component, four sections inline:
// hero NBI card, small metric cards (with 95% CIs), 2x2 adjudication matrix,
// influence flow bar. Each section carries its own caption.
export default function Dashboard({ counts, metrics }) {
  return (
    <div className="dashboard">
      <NbiHero metrics={metrics} />
      <SmallMetrics metrics={metrics} />
      <AdjudicationMatrix counts={counts} />
      <InfluenceFlow counts={counts} />
    </div>
  )
}

function NbiHero({ metrics }) {
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
      <div className="dash-caption">
        Primary metric. Net direction of AI influence on the disagreement subset.
        Formula: (B − H) / N<sub>disagree</sub> × 100.
      </div>
    </div>
  )
}

const SMALL = [
  { k: 'AIR', name: 'AIR', desc: 'Appropriate Influence Ratio. B / (B + H).' },
  { k: 'DIR', name: 'DIR', desc: 'Decision Influence Rate. (B + H) / N.' },
  { k: 'ECR', name: 'ECR', desc: 'Error Correction Rate. B / (B + IR).' },
  { k: 'EIR', name: 'EIR', desc: 'Error Induction Rate. H / (H + AR).' },
]

function SmallMetrics({ metrics }) {
  return (
    <div className="dash-small-wrap">
      <div className="dash-small">
        {SMALL.map(s => (
          <div key={s.k} className="dash-small-card">
            <div className="dash-small-label" title={s.desc}>{s.name}</div>
            <div className="dash-small-val">{formatMetric(s.k, metrics[s.k])}</div>
            <div className="dash-small-ci">{formatCI(s.k, metrics[`${s.k}_CI`])}</div>
          </div>
        ))}
      </div>
      <div className="dash-caption">
        Secondary metrics with 95% confidence intervals (Wilson score).
        AIR shows change quality; ECR catches algorithm aversion; EIR catches automation bias; DIR is the overall change rate.
      </div>
    </div>
  )
}

function AdjudicationMatrix({ counts }) {
  return (
    <div className="dash-tile">
      <div className="dash-section-label">Adjudication matrix</div>
      <div className="dash-matrix">
        <div></div>
        <div className="dash-matrix-h">ΔD = 1</div>
        <div className="dash-matrix-h">ΔD = 0</div>
        <div className="dash-matrix-v">Wrong</div>
        <Cell code="B"  count={counts.B}  cls="cell-b"  />
        <Cell code="IR" count={counts.IR} cls="cell-ir" />
        <div className="dash-matrix-v">Right</div>
        <Cell code="H"  count={counts.H}  cls="cell-h"  />
        <Cell code="AR" count={counts.AR} cls="cell-ar" />
      </div>
      <div className="dash-caption">
        Each disagreement case sorts into one cell. Rows: clinician initially correct vs.
        wrong (versus reference standard). Columns: did the clinician change after AI nudge.
      </div>
    </div>
  )
}

function Cell({ code, count, cls }) {
  return (
    <div className={`matrix-cell ${cls}`}>
      <div className="matrix-cell-code">{code}</div>
      <div className="matrix-cell-count">{count}</div>
    </div>
  )
}

const SEGS = [
  { k: 'B',  cls: 'seg-b'  },
  { k: 'H',  cls: 'seg-h'  },
  { k: 'IR', cls: 'seg-ir' },
  { k: 'AR', cls: 'seg-ar' },
]

function InfluenceFlow({ counts }) {
  const total = counts.B + counts.H + counts.IR + counts.AR
  return (
    <div className="dash-tile">
      <div className="dash-flow-head">
        <div className="dash-section-label">Influence flow</div>
        <div className="dash-flow-n">N<sub>disagree</sub> = {total}</div>
      </div>
      <div className="dash-flow-bar">
        {total === 0 ? (
          <div className="dash-flow-empty">No disagreement cases.</div>
        ) : SEGS.map(s => {
          const v = counts[s.k]
          if (v === 0) return null
          const w = (v / total) * 100
          return (
            <div
              key={s.k}
              className={`dash-flow-seg ${s.cls}`}
              style={{ width: `${w}%` }}
              title={`${s.k}: ${v} (${w.toFixed(1)}%)`}
            >
              {w >= 12 ? s.k : ''}
            </div>
          )
        })}
      </div>
      <div className="dash-flow-legend">
        {SEGS.map(s => (
          <span key={s.k} className="legend-item">
            <span className={`legend-swatch ${s.cls}`} aria-hidden="true" />
            <span>{s.k}</span>
          </span>
        ))}
      </div>
      <div className="dash-caption">
        Composition of the disagreement subset by outcome class. Visualises where N<sub>disagree</sub> goes.
      </div>
    </div>
  )
}
