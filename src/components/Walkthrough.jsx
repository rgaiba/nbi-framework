import React from 'react'

const STEPS = [
  {
    n: '01',
    title: 'Trigger Event',
    body: 'A binary clinical decision is required — for example, an ECG to read, an image to classify, a risk threshold to cross. The same input is presented simultaneously to both the expert and the AI.',
    tag: 'Input',
  },
  {
    n: '02',
    title: 'Independent Assessment',
    body: 'The expert records an initial binary decision (D₍ᵢ₎). The AI produces its output (A). The two are captured independently and in parallel — neither sees the other yet.',
    tag: 'Dᵢ vs. A',
  },
  {
    n: '03',
    title: 'Agreement Check',
    body: 'If D₍ᵢ₎ = A, the case exits the influence loop — AI cannot have changed anything. Only when D₍ᵢ₎ ≠ A does AI have an opportunity to influence the decision.',
    tag: 'Disagreement only',
  },
  {
    n: '04',
    title: 'Final Decision',
    body: 'On disagreement, the expert is shown the AI output and may revise. The final decision (D₍f₎) is recorded, ΔD = 1 if D₍f₎ ≠ D₍ᵢ₎. Adjudication against the reference standard then classifies the case as B, H, AR, or IR.',
    tag: 'D₟ · ΔD',
  },
]

const MATRIX = [
  { code: 'B',  name: 'Beneficial Change',     row: 'Initially Incorrect', col: 'Decision Changed',   arrow: 'Wrong → Right',  cls: 'cell-b'  },
  { code: 'IR', name: 'Inappropriate Resistance', row: 'Initially Incorrect', col: 'Decision Unchanged', arrow: 'Wrong → Wrong',  cls: 'cell-ir' },
  { code: 'H',  name: 'Harmful Change',        row: 'Initially Correct',   col: 'Decision Changed',   arrow: 'Right → Wrong',  cls: 'cell-h'  },
  { code: 'AR', name: 'Appropriate Resistance',row: 'Initially Correct',   col: 'Decision Unchanged', arrow: 'Right → Right',  cls: 'cell-ar' },
]

export default function Walkthrough() {
  return (
    <section id="framework" className="walkthrough">
      <div className="container">
        <div className="sec-label">
          <div className="bar" />
          <div className="txt">The Framework</div>
          <div className="line" />
        </div>

        <div className="walkthrough-intro">
          <h2>A four-step operational sequence.</h2>
          <p className="lede">
            NBI applies to any binary AI decision-support setting where (1) the expert can record
            their own decision before seeing the AI output, and (2) a reference standard exists for
            retrospective adjudication. Examples include AI-ECG triage, AI radiology pre-reads,
            dermatology classifiers, sepsis predictors, and pathology assistants.
          </p>
        </div>

        <ol className="step-grid">
          {STEPS.map(s => (
            <li key={s.n} className="step-card card card-hover">
              <div className="step-num">{s.n}</div>
              <div className="step-tag">{s.tag}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-body">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="constraint-note">
          <div className="constraint-icon" aria-hidden="true">⊕</div>
          <div className="constraint-body">
            <h4>Foundational constraint</h4>
            <p>
              AI can only exert influence when expert and AI <em>disagree</em>. When they agree, no
              causal contribution of AI is possible — the outcome would have occurred either way.
              By restricting analysis to disagreement cases, NBI yields a mechanistically defensible
              estimate of AI-attributable benefit and harm.
            </p>
          </div>
        </div>

        <div className="sec-label" style={{ marginTop: '48px' }}>
          <div className="bar" />
          <div className="txt">Adjudication Matrix</div>
          <div className="line" />
        </div>

        <div className="walkthrough-intro">
          <h2>Each disagreement case sorts into one of four cells.</h2>
          <p className="lede">
            After comparing the initial decision (D₍ᵢ₎) against the reference standard and observing
            whether the expert changed their mind (ΔD), every disagreement case becomes a B, H, IR, or AR.
            These four counts feed every metric on this site.
          </p>
        </div>

        <div className="matrix-2x2">
          {MATRIX.map(m => (
            <div key={m.code} className={`mcell-static ${m.cls}`}>
              <div className="mcell-corner">{m.code}</div>
              <div className="mcell-meta">
                <div className="mcell-row">{m.row}</div>
                <div className="mcell-col">{m.col}</div>
              </div>
              <div className="mcell-name">{m.name}</div>
              <div className="mcell-arrow">{m.arrow}</div>
            </div>
          ))}
        </div>

        <div className="formula-row">
          <h4>Five canonical metrics</h4>
          <ul className="formula-list">
            <li><strong>NBI</strong>&nbsp;<span className="muted">— Net Beneficial Influence (primary)</span><br/>
              <code className="formula">(<span className="var-b">B</span> − <span className="var-h">H</span>) / N<sub>disagree</sub> × 100</code>
            </li>
            <li><strong>AIR</strong>&nbsp;<span className="muted">— Appropriate Influence Ratio</span><br/>
              <code className="formula"><span className="var-b">B</span> / (<span className="var-b">B</span> + <span className="var-h">H</span>)</code>
            </li>
            <li><strong>ECR</strong>&nbsp;<span className="muted">— Error Correction Rate</span><br/>
              <code className="formula"><span className="var-b">B</span> / (<span className="var-b">B</span> + <span className="var-ir">IR</span>) × 100</code>
            </li>
            <li><strong>EIR</strong>&nbsp;<span className="muted">— Error Induction Rate</span><br/>
              <code className="formula"><span className="var-h">H</span> / (<span className="var-h">H</span> + <span className="var-ar">AR</span>) × 100</code>
            </li>
            <li><strong>DIR</strong>&nbsp;<span className="muted">— Decision Influence Rate</span><br/>
              <code className="formula">(<span className="var-b">B</span> + <span className="var-h">H</span>) / N<sub>disagree</sub> × 100</code>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
