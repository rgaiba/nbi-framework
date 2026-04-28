import React from 'react'
import { SCENARIOS } from '../../lib/scenarios.js'
import { computeMetrics, formatMetric } from '../../lib/nbi.js'

export default function ScenarioInput({ activeId, onLoad }) {
  return (
    <div className="scenario-input">
      <p className="muted scenario-help">
        These pre-built outcome distributions illustrate how the metrics behave under different
        reader-AI interaction patterns. Click a card to load — the dashboard below will update.
      </p>
      <div className="scenario-grid">
        {SCENARIOS.map(s => {
          const m = computeMetrics(s.counts)
          const isActive = s.id === activeId
          return (
            <button
              key={s.id}
              className={`scenario-card scenario-${s.accent} ${isActive ? 'is-active' : ''}`}
              onClick={() => onLoad(s.id)}
              aria-pressed={isActive}
            >
              <div className="scenario-head">
                <span className="scenario-title">{s.name}</span>
                {isActive && <span className="scenario-active-pill">Loaded</span>}
              </div>
              <div className="scenario-tagline">{s.tagline}</div>
              <p className="scenario-desc">{s.description}</p>

              <div className="scenario-mini">
                <div><span className="mini-k">B</span><span className="mini-v">{s.counts.B}</span></div>
                <div><span className="mini-k">H</span><span className="mini-v">{s.counts.H}</span></div>
                <div><span className="mini-k">IR</span><span className="mini-v">{s.counts.IR}</span></div>
                <div><span className="mini-k">AR</span><span className="mini-v">{s.counts.AR}</span></div>
              </div>

              <div className="scenario-nbi">
                <span className="muted">NBI</span>{' '}
                <span className={`scenario-nbi-val ${m.NBI > 0 ? 'pos' : m.NBI < 0 ? 'neg' : 'zero'}`}>
                  {formatMetric('NBI', m.NBI)}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
