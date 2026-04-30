import React, { useState } from 'react'
import AdjudicationMatrix from '../shared/AdjudicationMatrix.jsx'
import NbiHero from './NbiHero.jsx'
import SmallMetrics from './SmallMetrics.jsx'
import InfluenceFlow from './InfluenceFlow.jsx'

// Compact dashboard. NBI hero + four small metric cards by default.
// Adjudication matrix and influence flow live behind a "Show details"
// toggle anchored at the bottom of the pane.
export default function Dashboard({ counts, metrics }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="dashboard">
      <NbiHero metrics={metrics} />
      <SmallMetrics metrics={metrics} />

      {showDetails && (
        <div className="dash-details">
          <div className="dash-tile">
            <div className="dash-section-label">Adjudication matrix</div>
            <AdjudicationMatrix counts={counts} />
          </div>
          <InfluenceFlow counts={counts} />
        </div>
      )}

      <button
        className="dash-toggle"
        onClick={() => setShowDetails(s => !s)}
        aria-expanded={showDetails}
        aria-controls="dash-details"
      >
        <span>{showDetails ? 'Hide details' : 'Show adjudication matrix and influence flow'}</span>
        <span className={`dash-toggle-chev ${showDetails ? 'is-open' : ''}`} aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
    </div>
  )
}
