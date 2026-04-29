import React, { useState } from 'react'
import { interpretMetric, formatMetric, formatCI } from '../../lib/nbi.js'

// Inline colored variable chip used in formulas.
function Chip({ k }) {
  return <span className={`def-chip def-chip-${k}`}>{k}</span>
}

// Render a fraction: numerator stacked over denominator, optional ×100 trailing.
function Frac({ num, den, mult }) {
  return (
    <span className="frac">
      <span className="frac-stack">
        <span className="frac-num">{num}</span>
        <span className="frac-line" />
        <span className="frac-den">{den}</span>
      </span>
      {mult && <span className="frac-mult">{mult}</span>}
    </span>
  )
}

// Compact dashboard. Each tile shows the result on the left and the formula
// (as a stacked fraction) on the right. A horizontal rule separates the
// data block from the interpretation block below.
export default function Dashboard({ counts, metrics }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="dashboard">
      <NbiHero metrics={metrics} />
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

function NbiHero({ metrics }) {
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
          <Frac
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

// Order: DIR, AIR, ECR, EIR.
const SMALL = [
  {
    k: 'DIR',
    expansion: 'Decision Influence Rate',
    desc: 'Overall change rate',
    num: (<><Chip k="B" /> + <Chip k="H" /></>),
    den: (<>N<sub>disagree</sub></>),
    mult: '× 100',
  },
  {
    k: 'AIR',
    expansion: 'Appropriate Influence Ratio',
    desc: 'Change quality',
    num: (<><Chip k="B" /></>),
    den: (<><Chip k="B" /> + <Chip k="H" /></>),
  },
  {
    k: 'ECR',
    expansion: 'Error Correction Rate',
    desc: 'Errors corrected',
    num: (<><Chip k="B" /></>),
    den: (<><Chip k="B" /> + <Chip k="IR" /></>),
    mult: '× 100',
  },
  {
    k: 'EIR',
    expansion: 'Error Induction Rate',
    desc: 'Errors induced',
    num: (<><Chip k="H" /></>),
    den: (<><Chip k="H" /> + <Chip k="AR" /></>),
    mult: '× 100',
  },
]

function SmallMetrics({ metrics }) {
  return (
    <div className="dash-small">
      {SMALL.map(s => {
        const ci = formatCI(s.k, metrics[`${s.k}_CI`])
        return (
          <div key={s.k} className="dash-small-card">
            <div className="dash-small-expansion">{s.expansion}</div>
            <div className="dash-small-body">
              <div className="dash-small-left">
                <div className="dash-small-val">{formatMetric(s.k, metrics[s.k])}</div>
                <div className="dash-small-ci">{ci ? `95% CI ${ci}` : ''}</div>
              </div>
              <div className="dash-small-right">
                <Frac num={s.num} den={s.den} mult={s.mult} />
              </div>
            </div>
            <div className="dash-small-desc">{s.desc}</div>
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
    </div>
  )
}

// Reusable matrix grid. When counts is provided, shows numeric counts.
// When counts is undefined, shows just the colored chips (Definitions tab).
export function AdjMatrixGrid({ counts }) {
  const showCounts = counts !== undefined && counts !== null
  return (
    <div className="adj-matrix-frame">
      <div className="adj-matrix-x-title">Clinician decision after AI recommendation</div>
      <div className="adj-matrix-body">
        <div className="adj-matrix-y-title">
          <span>Initial decision</span>
        </div>
        <div className="adj-matrix-grid">
          <div></div>
          <div className="adj-matrix-col-hdr">
            <strong>Changed</strong>
            <span className="adj-matrix-col-sub">D<sub>f</sub> ≠ D<sub>i</sub></span>
          </div>
          <div className="adj-matrix-col-hdr">
            <strong>Unchanged</strong>
            <span className="adj-matrix-col-sub">D<sub>f</sub> = D<sub>i</sub></span>
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
