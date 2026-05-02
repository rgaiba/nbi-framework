import React from 'react'
import Chip from './shared/Chip.jsx'

function SigCell({ code, count, cls }) {
  return (
    <div className={`sig-cell ${cls}`}>
      <Chip k={code} />
      <span className="sig-cell-count">{count}</span>
    </div>
  )
}

function SignatureCard({ title, subtitle, counts, metrics, interp }) {
  return (
    <div className="sig-card">
      <div className="sig-title">{title}</div>
      <div className="sig-subtitle">{subtitle}</div>

      <div className="sig-matrix">
        <div></div>
        <div className="sig-matrix-h">Changed</div>
        <div className="sig-matrix-h">Unchanged</div>
        <div className="sig-matrix-v">Wrong</div>
        <SigCell code="B"  count={counts.B}  cls="cell-b"  />
        <SigCell code="IR" count={counts.IR} cls="cell-ir" />
        <div className="sig-matrix-v">Right</div>
        <SigCell code="H"  count={counts.H}  cls="cell-h"  />
        <SigCell code="AR" count={counts.AR} cls="cell-ar" />
      </div>

      <div className="sig-metrics">{metrics}</div>
      <div className="sig-interp">{interp}</div>
    </div>
  )
}

const SIGNATURES = [
  {
    title: 'Calibrated clinician',
    subtitle: 'the goal',
    counts: { B: 28, H: 6, IR: 8, AR: 38 },
    metrics: 'NBI +27.5% · ECR 77.8% · EIR 13.6%',
    interp: 'Selective trust. Errors corrected when AI flags them; correct decisions hold under AI pushback.',
  },
  {
    title: 'High trust with accurate AI',
    subtitle: 'net benefit at a cost',
    counts: { B: 72, H: 8, IR: 18, AR: 2 },
    metrics: 'NBI +64% · ECR 80% · EIR 80%',
    interp: 'Indiscriminate revision, but the AI is mostly correct. Strong net benefit; most rare correct cases get overturned. Aggregate methods report only the +64%.',
  },
  {
    title: 'High trust with low-accuracy AI',
    subtitle: 'net harm',
    counts: { B: 18, H: 22, IR: 4, AR: 14 },
    metrics: 'NBI −6.9% · EIR 61.1% · AIR 0.45',
    interp: 'High trust behavior, low AI accuracy. Indiscriminate revision of correct decisions to errors at scale; the net effect may be harmful.',
  },
  {
    title: 'Low trust',
    subtitle: 'algorithm aversion',
    counts: { B: 4, H: 1, IR: 22, AR: 33 },
    metrics: 'ECR 15.4% · DIR 8.3% · NBI +5%',
    interp: 'Clinician rarely revises, even when AI is correct. Most flagged errors go uncorrected; AI is in the loop but contributing little.',
  },
]

export default function About() {
  return (
    <article className="about-page">
      <h1 className="about-title">
        The Net Beneficial Influence Framework: Quantifying Cooperative Human-AI Decision-Making
      </h1>

      <p className="about-text">
        Current artificial intelligence (AI) evaluation methods ask, "Is AI better than clinicians?" While this question is necessary, it is not sufficient. It does not translate directly into improved diagnostic accuracy or outcomes unless clinicians use AI and change their decisions as a result. Contrary to the now-common phrase "human-in-the-loop," AI, in fact, is in the loop. And, humans are the final decision-makers, at least for now. Biases both in favor of and against AI have been well documented, and delivering the benefits of higher AI accuracy depends on baseline diagnostic accuracies and patterns of AI utilization by clinicians.
      </p>

      <p className="about-text">
        The Net Beneficial Influence (NBI) framework asks, "Does using AI make clinicians better?" A 2 × 2 matrix adjudicates the initial and final clinician decisions against a reference standard, and five explainable metrics are calculated. Cases in which AI and clinicians agree on a decision offer no incremental benefit in improving the clinician's accuracy attributable to AI use. Such cases are excluded from the calculation, and only cases of disagreement are included.
      </p>

      <p className="about-text">
        The primary output is a Net Beneficial Influence (NBI), along with four secondary metrics that further characterize the outcome of AI-clinician interaction, quantitatively. The following four patterns demonstrate the multiple possibilities across different levels of AI accuracy and clinician trust.
      </p>

      <div className="signature-grid">
        {SIGNATURES.map((s, i) => (
          <SignatureCard key={i} {...s} />
        ))}
      </div>

      <h2 className="about-h2">Limitations</h2>
      <ul className="about-list">
        <li>Metrics are proportional and depend on N<sub>disagree</sub>, not total workload; absolute counts should accompany rates.</li>
        <li>Agreement cases are excluded by design; the framework measures incremental AI influence, not overall clinical accuracy.</li>
        <li>Adjudication captures decision fidelity at the point of care; it does not replace long-term outcome studies.</li>
      </ul>

      <div className="about-author">
        <p className="about-author-line">
          Rahul Gaiba, MD,<br />
          Bayhealth Medical Center, Dover, Delaware.
        </p>
        <p className="about-citation">
          Suggested citation: Gaiba, R. <em>The Net Beneficial Influence Framework: Quantifying Cooperative Human-AI Decision-Making.</em> Version 1.0. April 2026. nbi.rahulgaibamd.com. A formal methods description is forthcoming.
        </p>
      </div>
    </article>
  )
}
