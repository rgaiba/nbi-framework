import React from 'react'
import { SCENARIOS } from '../../lib/scenarios.js'
import { computeMetrics, formatMetric } from '../../lib/nbi.js'

export default function ScenarioInput({ activeId, onLoad }) {
  return (
    <div className="scenarios">
      <p className="muted">
        Pre-built outcome distributions illustrating common reader-AI interaction patterns.
        Click a card to load.
      </p>
      <div className="scenarios-list">
        {SCENARIOS.map(s => {
          const m = computeMetrics(s.counts)
          const isActive = s.id === activeId
          const nbiCls = m.NBI > 0 ? 'val-pos' : m.NBI < 0 ? 'val-neg' : 'val-zero'
          return (
            <button
              key={s.id}
              className={`scenario ${isActive ? 'is-active' : ''}`}
              onClick={() => onLoad(s.id)}
              aria-pressed={isActive}
            >
              <div className="scenario-row">
                <span className="scenario-name">{s.name}</span>
                <span className={`scenario-nbi ${nbiCls}`}>
                  {formatMetric('NBI', m.NBI)}
                </span>
              </div>
              <div className="scenario-meta muted">
                {s.tagline}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
