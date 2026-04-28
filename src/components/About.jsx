import React from 'react'

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="sec-label">
          <div className="bar" />
          <div className="txt">About</div>
          <div className="line" />
        </div>

        <div className="about-grid">
          <div className="about-main">
            <h2>An evaluation framework for cooperative human-AI decisions.</h2>
            <p>
              Most AI evaluation frameworks measure model accuracy against a reference standard.
              That captures whether the algorithm <em>could</em> get the right answer — not whether
              its presence in a real workflow <em>actually changes</em> what a clinician decides,
              and whether the change is in the right direction.
            </p>
            <p>
              The Net Beneficial Influence framework restricts attention to the only situation in
              which an AI tool can causally influence a decision: when expert and AI <em>disagree</em>.
              Within that subset, every decision change is adjudicated against a reference standard
              and classified as beneficial, harmful, or appropriate resistance. The five resulting
              metrics quantify the directional effect — and let governance, regulators, and
              individual clinicians distinguish algorithm accuracy from clinical utility.
            </p>
            <p>
              The framework is domain-general. It applies wherever an expert renders a binary
              judgement and an AI tool offers a binary recommendation: ECG triage, radiology
              pre-reads, dermatology classification, sepsis prediction, pathology assistance,
              ophthalmology screening, and beyond.
            </p>

            <h3 className="about-sub">Why disagreement-only?</h3>
            <p>
              When expert and AI agree, the AI made no incremental contribution — the outcome
              would have been the same. Aggregating accuracy across all cases mixes AI-attributable
              effects with cases the AI never touched. The disagreement restriction yields a
              mechanistically defensible estimate of AI&rsquo;s actual influence.
            </p>

            <h3 className="about-sub">What this framework adds</h3>
            <ul className="about-list">
              <li>Mechanistic attribution of accuracy changes to AI, rather than aggregate gain.</li>
              <li>Quantification of automation bias (high EIR) and algorithm aversion (low ECR).</li>
              <li>Detection of deskilling and upskilling over longitudinal monitoring.</li>
              <li>Comparable, post-deployment metrics for AI governance and surveillance.</li>
            </ul>
          </div>

          <aside className="about-side">
            <div className="about-card card">
              <div className="eyebrow">Originator</div>
              <h3>Rahul Gaiba, MD</h3>
              <p className="muted">
                Internal medicine physician, Bayhealth Medical Center, Dover, Delaware.
                Author of the Net Beneficial Influence framework, Version 1.0.
              </p>
              <div className="about-meta">
                <div><span className="muted">Framework version</span><strong>1.0</strong></div>
                <div><span className="muted">First published</span><strong>February 2026</strong></div>
                <div><span className="muted">Demo released</span><strong>April 2026</strong></div>
              </div>
            </div>

            <div className="about-card card">
              <div className="eyebrow">Suggested citation</div>
              <p className="cite">
                Gaiba R. <em>The Net Beneficial Influence Framework: Quantifying Cooperative
                Human-AI Decision-Making.</em> Version 1.0. April 2026.{' '}
                <code className="formula">nbi.rahulgaibamd.com</code>
              </p>
            </div>

            <div className="about-card card">
              <div className="eyebrow">First application</div>
              <h4 className="about-app">NBI-QoH Study</h4>
              <p className="muted">
                A multicenter evaluation of the Queen of Hearts AI-ECG algorithm using the NBI
                framework — protocol in development, 2026.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
