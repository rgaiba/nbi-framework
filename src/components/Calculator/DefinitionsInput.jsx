import React from 'react'
import AdjudicationMatrix from '../shared/AdjudicationMatrix.jsx'
import Chip from '../shared/Chip.jsx'

// Definitions tab: variable legend + adjudication matrix structure +
// N_disagree composition formula. Live values appear in the dashboard.
export default function DefinitionsInput() {
  return (
    <div className="definitions">
      <p className="muted">
        Variable definitions (all binary 0/1) and the structure of the adjudication matrix.
      </p>

      <div className="legend-box">
        <dl className="legend-grid legend-grid-2col">
          <dt>D<sub>i</sub></dt> <dd>Clinician's initial decision</dd>
          <dt>A</dt>             <dd>AI's recommendation</dd>
          <dt>D<sub>f</sub></dt> <dd>Clinician's final decision</dd>
          <dt>R</dt>             <dd>Reference standard</dd>
        </dl>
        <div className="legend-agreement legend-agreement-center">
          Agreement cases (D<sub>i</sub> = A) offer no incremental value from AI use and are therefore excluded from the adjudication matrix.
        </div>
      </div>

      <div className="def-matrix-box">
        <div className="dash-section-label">Adjudication matrix</div>
        <AdjudicationMatrix />
        <div className="dash-symbolic dash-symbolic-bordered">
          N<sub>disagree</sub> = <Chip k="B" /> + <Chip k="H" /> + <Chip k="IR" /> + <Chip k="AR" />
        </div>
      </div>
    </div>
  )
}
