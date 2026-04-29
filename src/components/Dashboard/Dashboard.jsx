import React, { useState } from 'react'
import { interpretMetric, formatMetric, formatCI } from '../../lib/nbi.js'

// Compact dashboard.
// Default view: NBI hero + four small metric cards (mnemonic + full name + value).
// Toggleable details: 2×2 adjudication matrix and influence flow.
export default function Dashboard({ counts, metrics }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="dashboard">
      <NbiHero counts={counts} metrics={metrics} />
      <SmallMetrics metrics={metrics} />

      {showDetails && (
        <div className="dash-details">
          <AdjudicationMatrix counts={counts} />
          <InfluenceFlow counts={counts} />
        </div>
      )}

      <button
        className="dash-toggle"
        onClick={() => setShowDetails(s => !s)}
        aria-expanded={showDetails}
        aria-controls="dash-details"
      >
        <span>{showDetails ? 'Hide details' : 'Show adjudication matrix and influence flow'}</span>
        <span className={`dash-toggle-chev ${showDetails ? 'is-open' : ''}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
    </div>
  )
}

function NbiHero({ counts, metrics }) {
  const v = metrics.NBI
  const interp = interpretMetric('NBI', v)
  const cls = v === null ? '' : v > 0 ? 'val-pos' : v < 0 ? 'val-neg' : 'val-zero'
  const display = v === null ? 'n/a' : `${v > 0 ? '+' : ''}${v.toFixed(1)}%`
  const ci = formatCI('NBI', metrics.NBI_CI)
  const N = metrics.Ndisagree

  return (
    <div className="dash-hero">
      <div className="dash-hero-label">Net beneficial influence</div>
      <div className="dash-hero-row">
        <div className={`dash-hero-val ${cls}`}>{display}</div>
        {N > 0 && (
          <div className="dash-hero-formula" aria-label="Formula breakdown">
            = ({counts.B} − {counts.H}) / {N} × 100
          </div>
        )}
      </div>
      {ci && <div className="dash-hero-ci">95% CI {ci}</div>}
      <div className="dash-hero-interp">{interp}</div>
    </div>
  )
}

const SMALL = [
  { k: 'AIR', expansion: 'Appropriate Influence Ratio', desc: 'Change quality' },
  { k: 'DIR', expansion: 'Decision Influence Rate',     desc: 'Overall change rate' },
  { k: 'ECR', expansion: 'Error Correction Rate',       desc: 'Errors corrected' },
  { k: 'EIR', expansion: 'Error Induction Rate',        desc: 'Errors induced' },
]

function SmallMetrics({ metrics }) {
  return (
    <div className="dash-small">
      {SMALL.map(s => {
        const ci = formatCI(s.k, metrics[`${s.k}_CI`])
        return (
          <div key={s.k} className="dash-small-card">
            <div className="dash-small-mnemonic">{s.k}</div>
            <div className="dash-small-expansion">{s.expansion}</div>
            <div className="dash-small-val">{formatMetric(s.k, metrics[s.k])}</div>
            <div className="dash-small-desc">{s.desc}</div>
            <div className="dash-small-ci">{ci ? `95% CI ${ci}` : ''}</div>
          </div>
        )
      })}
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
        Composition of the disagreement subset by outcome class.
        Visualises where N<sub>disagree</sub> goes.
      </div>
    </div>
  )
}
