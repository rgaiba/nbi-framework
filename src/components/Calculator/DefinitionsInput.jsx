import React from 'react'

// Definitions tab: variable legend only. Each metric's formula now lives
// next to its computed value in the dashboard.
export default function DefinitionsInput() {
  return (
    <div className="definitions">
      <p className="muted">
        Variable definitions for the framework. Formulas for the five metrics
        are displayed alongside their computed values in the dashboard.
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

      <div className="legend-box">
        <dl className="legend-grid legend-grid-2col">
          <dt><span className="def-chip def-chip-B">B</span></dt>
            <dd>Beneficial change. Wrong → Right.</dd>
          <dt><span className="def-chip def-chip-H">H</span></dt>
            <dd>Harmful change. Right → Wrong.</dd>
          <dt><span className="def-chip def-chip-IR">IR</span></dt>
            <dd>Inappropriate resistance. Wrong → Wrong.</dd>
          <dt><span className="def-chip def-chip-AR">AR</span></dt>
            <dd>Appropriate resistance. Right → Right.</dd>
        </dl>
      </div>
    </div>
  )
}
