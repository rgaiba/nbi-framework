import React from 'react'
import { AdjMatrixGrid } from '../Dashboard/Dashboard.jsx'

// Definitions tab: variable legend, then the adjudication matrix structure
// (no counts, just the four classes shown as chips). Helps users see how
// B / H / IR / AR are derived from the two binary axes.
export default function DefinitionsInput() {
  return (
    <div className="definitions">
      <p className="muted">
        Variable definitions and the structure of the adjudication matrix.
        Live values and formulas appear in the dashboard.
      </p>

      <div className="legend-box">
        <dl className="legend-grid legend-grid-2col">
          <dt>D<sub>i</sub></dt> <dd>Clinician's initial decision</dd>
          <dt>A</dt>             <dd>AI's recommendation</dd>
          <dt>D<sub>f</sub></dt> <dd>Clinician's final decision</dd>
          <dt>R</dt>             <dd>Reference standard. Binary 0/1.</dd>
        </dl>
        <div className="legend-agreement legend-agreement-center">
          Agreement cases (D<sub>i</sub> = A) are adjudicated but excluded from N<sub>disagree</sub>.
        </div>
      </div>

      <div className="def-matrix-box">
        <div className="def-section-label">Adjudication matrix</div>
        <AdjMatrixGrid />
        <div className="def-meaning">
          Each disagreement case is classified by two binary axes. The Y-axis
          asks whether the clinician's initial decision matched the reference
          standard. The X-axis asks whether the clinician changed their decision
          after seeing the AI's recommendation.
        </div>
      </div>
    </div>
  )
}
