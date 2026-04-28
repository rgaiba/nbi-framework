import React, { useState } from 'react'
import DirectInput from './DirectInput.jsx'
import ScenarioInput from './ScenarioInput.jsx'
import PerCaseInput from './PerCaseInput.jsx'

const TABS = [
  { id: 'direct',    label: 'Direct' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'cases',     label: 'Per-case' },
]

export default function Calculator({
  counts, updateCounts, loadScenario, activeScenarioId, setActiveScenarioId,
}) {
  const [tab, setTab] = useState('direct')

  return (
    <div className="calc">
      <div className="calc-tabs" role="tablist" aria-label="Input modes">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`calc-tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="calc-panel">
        {tab === 'direct' && (
          <DirectInput
            counts={counts}
            updateCounts={updateCounts}
            onAnyChange={() => setActiveScenarioId(null)}
          />
        )}
        {tab === 'scenarios' && (
          <ScenarioInput activeId={activeScenarioId} onLoad={loadScenario} />
        )}
        {tab === 'cases' && (
          <PerCaseInput
            applyCounts={(next) => { updateCounts(next); setActiveScenarioId(null) }}
          />
        )}
      </div>
    </div>
  )
}
