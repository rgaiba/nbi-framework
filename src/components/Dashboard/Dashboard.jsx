import React from 'react'
import OutcomesMatrix from './OutcomesMatrix.jsx'
import MetricCards from './MetricCards.jsx'
import FlowChart from './FlowChart.jsx'
import SensitivitySweep from './SensitivitySweep.jsx'

export default function Dashboard({ counts, metrics }) {
  return (
    <section id="dashboard" className="dashboard bg-mesh">
      <div className="container">
        <div className="sec-label">
          <div className="bar" />
          <div className="txt">Live Dashboard</div>
          <div className="line" />
        </div>

        <div className="walkthrough-intro">
          <h2>Outcomes &amp; metrics, computed in real time.</h2>
          <p className="lede">
            Every chart below is driven by the four counts above. Adjust the calculator and watch
            the dashboard respond instantly.
          </p>
        </div>

        <MetricCards metrics={metrics} />

        <div className="dash-grid">
          <div className="dash-tile">
            <div className="dash-tile-head">
              <h3>2 × 2 Adjudication Matrix</h3>
              <p className="muted">Outcomes from disagreement cases, coloured by class.</p>
            </div>
            <OutcomesMatrix counts={counts} />
          </div>

          <div className="dash-tile">
            <div className="dash-tile-head">
              <h3>Influence Flow</h3>
              <p className="muted">N<sub>disagree</sub> decomposed by outcome class.</p>
            </div>
            <FlowChart counts={counts} metrics={metrics} />
          </div>
        </div>

        <div className="dash-tile dash-tile-wide">
          <div className="dash-tile-head">
            <h3>Sensitivity Sweep</h3>
            <p className="muted">
              Vary one input across a range and watch the metrics respond. Useful for testing how
              robust your NBI result is to assumptions.
            </p>
          </div>
          <SensitivitySweep counts={counts} />
        </div>
      </div>
    </section>
  )
}
