import React, { useState } from 'react'
import AdjudicationMatrix from '../shared/AdjudicationMatrix.jsx'
import Chip from '../shared/Chip.jsx'
import Fraction from '../shared/Fraction.jsx'

// All five metric formulas, in canonical order: NBI, AIR, ECR, EIR, DIR.
const FORMULAE = [
  {
    k: 'NBI',
    name: 'Net Beneficial Influence',
    num: (<><Chip k="B" /> − <Chip k="H" /></>),
    den: (<>N<sub>disagree</sub></>),
    mult: '× 100',
  },
  {
    k: 'AIR',
    name: 'Appropriate Influence Ratio',
    num: (<><Chip k="B" /></>),
    den: (<><Chip k="B" /> + <Chip k="H" /></>),
  },
  {
    k: 'ECR',
    name: 'Error Correction Rate',
    num: (<><Chip k="B" /></>),
    den: (<><Chip k="B" /> + <Chip k="IR" /></>),
    mult: '× 100',
  },
  {
    k: 'EIR',
    name: 'Error Induction Rate',
    num: (<><Chip k="H" /></>),
    den: (<><Chip k="H" /> + <Chip k="AR" /></>),
    mult: '× 100',
  },
  {
    k: 'DIR',
    name: 'Decision Influence Rate',
    num: (<><Chip k="B" /> + <Chip k="H" /></>),
    den: (<>N<sub>disagree</sub></>),
    mult: '× 100',
  },
]

export default function DefinitionsInput() {
  const [showFormulae, setShowFormulae] = useState(false)

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

      <button
        className="formulae-toggle"
        onClick={() => setShowFormulae(s => !s)}
        aria-expanded={showFormulae}
        aria-controls="formulae-panel"
      >
        <span>{showFormulae ? 'Hide formulae' : 'Show formulae'}</span>
        <span className={`formulae-toggle-chev ${showFormulae ? 'is-open' : ''}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {showFormulae && (
        <div id="formulae-panel" className="formulae-panel">
          {FORMULAE.map(f => (
            <div key={f.k} className="formulae-item">
              <div className="formulae-name">
                <strong>{f.k}</strong>
                <span className="formulae-name-expansion">{f.name}</span>
              </div>
              <div className="formulae-equation">
                <span className="formulae-equation-eq">=</span>
                <Fraction num={f.num} den={f.den} mult={f.mult} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
