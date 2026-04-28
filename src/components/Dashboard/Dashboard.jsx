import React from 'react'
import { interpretMetric, formatMetric } from '../../lib/nbi.js'

// Compact dashboard — single component, all four sections inline.
// Mirrors the approved prototype: NBI hero card → 2x2 small metrics →
// adjudication matrix → influence flow bar.
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
  const display = v === null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(1)}%`
  return (
    <div className="dash-hero">
      <div className="dash-hero-label">Net beneficial influence</div>
      <div className={`dash-hero-val ${cls}`}>{display}</div>
      <div className="dash-hero-interp">{interp}</div>
    </div>
  )
}

const SMALL = [
  { k: 'AIR', name: 'AIR' },
  { k: 'DIR', name: 'DIR' },
  { k: 'ECR', name: 'ECR' },
  { k: 'EIR', name: 'EIR' },
]

function SmallMetrics({ metrics }) {
  return (
    <div className="dash-small">
      {SMALL.map(s => (
        <div key={s.k} className="dash-small-card">
          <div className="dash-small-label">{s.name}</div>
          <div className="dash-small-val">{formatMetric(s.k, metrics[s.k])}</div>
        </div>
      ))}
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
    </div>
  )
}
