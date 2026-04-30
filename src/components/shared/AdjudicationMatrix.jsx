import React from 'react'

// 2x2 adjudication matrix with axis labels.
// When `counts` is provided, each cell shows the chip + numeric count.
// When `counts` is omitted, each cell shows the chip + a one-line caption
// (used in the Definitions tab as a teaching display).
function Cell({ code, count, cls, caption }) {
  return (
    <div className={`matrix-cell ${cls}`}>
      <span className={`def-chip def-chip-${code} matrix-cell-chip`}>{code}</span>
      {count !== undefined && <div className="matrix-cell-count">{count}</div>}
      {count === undefined && caption && <div className="matrix-cell-caption">{caption}</div>}
    </div>
  )
}

export default function AdjudicationMatrix({ counts }) {
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
          <div className="adj-matrix-row-hdr">
            <strong>Wrong</strong>
            <span className="adj-matrix-row-sub">D<sub>i</sub> ≠ R</span>
          </div>
          <Cell code="B"  count={showCounts ? counts.B  : undefined} cls="cell-b"  caption="Beneficial change" />
          <Cell code="IR" count={showCounts ? counts.IR : undefined} cls="cell-ir" caption="Inappropriate resistance" />
          <div className="adj-matrix-row-hdr">
            <strong>Right</strong>
            <span className="adj-matrix-row-sub">D<sub>i</sub> = R</span>
          </div>
          <Cell code="H"  count={showCounts ? counts.H  : undefined} cls="cell-h"  caption="Harmful change" />
          <Cell code="AR" count={showCounts ? counts.AR : undefined} cls="cell-ar" caption="Appropriate resistance" />
        </div>
      </div>
    </div>
  )
}
