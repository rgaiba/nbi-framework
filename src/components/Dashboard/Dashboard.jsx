import React, { useState } from 'react'
import { interpretMetric, formatMetric, formatCI } from '../../lib/nbi.js'

// Inline colored variable chip used in formulas.
function Chip({ k }) {
  return <span className={`def-chip def-chip-${k}`}>{k}</span>
}

// Compact dashboard. Each tile carries its own formula next to its result.
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
          <div className="dash-hero-formula" aria-label="Numeric breakdown">
            = ({counts.B} − {counts.H}) / {N} × 100
          </div>
        )}
      </div>
      {ci && <div className="dash-hero-ci">95% CI {ci}</div>}
      <div className="dash-hero-interp">{interp}</div>
      <div className="dash-symbolic">
        NBI = (<Chip k="B" /> − <Chip k="H" />) / N<sub>disagree</sub> × 100
      </div>
    </div>
  )
}

const SMALL = [
  {
    k: 'AIR',
    expansion: 'Appropriate Influence Ratio',
    desc: 'Change quality',
    formula: (<>AIR = <Chip k="B" /> / (<Chip k="B" /> + <Chip k="H" />)</>),
  },
  {
    k: 'DIR',
    expansion: 'Decision Influence Rate',
    desc: 'Overall change rate',
    formula: (<>DIR = (<Chip k="B" /> + <Chip k="H" />) / N<sub>disagree</sub> × 100</>),
  },
  {
    k: 'ECR',
    expansion: 'Error Correction Rate',
    desc: 'Errors corrected',
    formula: (<>ECR = <Chip k="B" /> / (<Chip k="B" /> + <Chip k="IR" />) × 100</>),
  },
  {
    k: 'EIR',
    expansion: 'Error Induction Rate',
    desc: 'Errors induced',
    formula: (<>EIR = <Chip k="H" /> / (<Chip k="H" /> + <Chip k="AR" />) × 100</>),
  },
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
            <div className="dash-small-formula">{s.formula}</div>
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
      <AdjMatrixGrid counts={counts} />
      <div className="dash-caption">
        Each disagreement case sorts into one cell. Y-axis: was the clinician's
        initial decision correct (vs. reference standard). X-axis: did the
        clinician change their decision after the AI nudge.
      </div>
      <div className="dash-symbolic dash-symbolic-bordered">
        N<sub>disagree</sub> = <Chip k="B" /> + <Chip k="H" /> + <Chip k="IR" /> + <Chip k="AR" />
      </div>
    </div>
  )
}

// Reusable matrix grid. When counts is provided, shows numeric counts.
// When counts is undefined, shows just the colored chips (Definitions tab).
export function AdjMatrixGrid({ counts }) {
  const showCounts = counts !== undefined && counts !== null
  return (
    <div className="adj-matrix-frame">
      <div className="adj-matrix-x-title">Decision changed after AI nudge</div>
      <div className="adj-matrix-body">
        <div className="adj-matrix-y-title">
          <span>Initial decision (vs. R)</span>
        </div>
        <div className="adj-matrix-grid">
          <div></div>
          <div className="adj-matrix-col-hdr">
            <strong>ΔD = 1</strong>
            <span className="adj-matrix-col-sub">changed</span>
          </div>
          <div className="adj-matrix-col-hdr">
            <strong>ΔD = 0</strong>
            <span className="adj-matrix-col-sub">unchanged</span>
          </div>
          <div className="adj-matrix-row-hdr"><strong>Wrong</strong><span className="adj-matrix-row-sub">D<sub>i</sub> ≠ R</span></div>
          <Cell code="B"  count={showCounts ? counts.B  : undefined} cls="cell-b"  caption="Beneficial change" />
          <Cell code="IR" count={showCounts ? counts.IR : undefined} cls="cell-ir" caption="Inappropriate resistance" />
          <div className="adj-matrix-row-hdr"><strong>Right</strong><span className="adj-matrix-row-sub">D<sub>i</sub> = R</span></div>
          <Cell code="H"  count={showCounts ? counts.H  : undefined} cls="cell-h"  caption="Harmful change" />
          <Cell code="AR" count={showCounts ? counts.AR : undefined} cls="cell-ar" caption="Appropriate resistance" />
        </div>
      </div>
    </div>
  )
}

function Cell({ code, count, cls, caption }) {
  return (
    <div className={`matrix-cell ${cls}`}>
      <span className={`def-chip def-chip-${code} matrix-cell-chip`}>{code}</span>
      {count !== undefined && <div className="matrix-cell-count">{count}</div>}
      {count === undefined && caption && <div className="matrix-cell-caption">{caption}</div>}
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
