import React from 'react'

// Colored variable chip used inside formulas. Matches the class-pill colors.
function Chip({ k }) {
  return <span className={`def-chip def-chip-${k}`}>{k}</span>
}

// Section block: a small uppercase label plus the formula content.
function DefSection({ label, children, meaning }) {
  return (
    <div className="def-section">
      <div className="def-section-label">{label}</div>
      <div className="def-formula">{children}</div>
      {meaning && <div className="def-meaning">{meaning}</div>}
    </div>
  )
}

export default function DefinitionsInput() {
  return (
    <div className="definitions">
      <p className="muted">
        Variable definitions and the five canonical formulas. Switch tabs to enter data.
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

      <DefSection label="Disagreement count">
        N<sub>disagree</sub> = <Chip k="B" /> + <Chip k="H" /> + <Chip k="IR" /> + <Chip k="AR" />
      </DefSection>

      <DefSection label="Primary outcome" meaning="Net direction of AI influence on the disagreement subset">
        NBI = (<Chip k="B" /> − <Chip k="H" />) / N<sub>disagree</sub> × 100
      </DefSection>

      <div className="def-section-label def-secondary-header">Secondary outcomes</div>

      <DefSection label="AIR · Appropriate Influence Ratio" meaning="Change quality. Of all decision changes, how many were beneficial.">
        AIR = <Chip k="B" /> / (<Chip k="B" /> + <Chip k="H" />)
      </DefSection>

      <DefSection label="ECR · Error Correction Rate" meaning="Of clinician errors, how many AI nudges successfully corrected.">
        ECR = <Chip k="B" /> / (<Chip k="B" /> + <Chip k="IR" />) × 100
      </DefSection>

      <DefSection label="EIR · Error Induction Rate" meaning="Of correct decisions challenged by AI, how many became errors.">
        EIR = <Chip k="H" /> / (<Chip k="H" /> + <Chip k="AR" />) × 100
      </DefSection>

      <DefSection label="DIR · Decision Influence Rate" meaning="Overall rate of decision change on AI disagreement.">
        DIR = (<Chip k="B" /> + <Chip k="H" />) / N<sub>disagree</sub> × 100
      </DefSection>
    </div>
  )
}
