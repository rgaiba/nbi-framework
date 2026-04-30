import React, { useState } from 'react'
import DefinitionsInput from './DefinitionsInput.jsx'
import PerCaseInput from './PerCaseInput.jsx'
import DirectInput from './DirectInput.jsx'

const TABS = [
  { id: 'definitions', label: 'Definitions' },
  { id: 'cases',       label: 'Per-case' },
  { id: 'direct',      label: 'Direct' },
]

export default function Calculator({ counts, updateCounts }) {
  const [tab, setTab] = useState('definitions')

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
        {tab === 'definitions' && <DefinitionsInput />}
        {tab === 'cases' && (
          <PerCaseInput applyCounts={updateCounts} />
        )}
        {tab === 'direct' && (
          <DirectInput counts={counts} updateCounts={updateCounts} />
        )}
      </div>
    </div>
  )
}
