import React, { useState } from 'react'
import ScenarioInput from './ScenarioInput.jsx'
import DirectInput from './DirectInput.jsx'
import PerCaseInput from './PerCaseInput.jsx'
import CsvInput from './CsvInput.jsx'

const TABS = [
  { id: 'scenarios', label: 'Scenarios',     hint: 'Pre-built reader profiles' },
  { id: 'direct',    label: 'Direct counts', hint: 'Adjust B, H, IR, AR' },
  { id: 'cases',     label: 'Per-case',      hint: 'Add cases one by one' },
  { id: 'csv',       label: 'Upload CSV',    hint: 'Import case-level data' },
]

export default function Calculator({
  counts, updateCounts, loadScenario, activeScenarioId, setActiveScenarioId,
}) {
  const [tab, setTab] = useState('scenarios')

  return (
    <section id="calculator" className="calculator">
      <div className="container">
        <div className="sec-label">
          <div className="bar" />
          <div className="txt">Interactive Calculator</div>
          <div className="line" />
        </div>

        <div className="walkthrough-intro">
          <h2>Plug in data — see all five metrics live.</h2>
          <p className="lede">
            Pick an input mode below. All four modes write to the same outcome counts
            (<code className="formula"><span className="var-b">B</span> · <span className="var-h">H</span> · <span className="var-ir">IR</span> · <span className="var-ar">AR</span></code>),
            which power the dashboard further down. Changes propagate instantly.
          </p>
        </div>

        <div className="calc-tabs" role="tablist" aria-label="Input modes">
          {TABS.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`calc-tab ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="calc-tab-label">{t.label}</span>
              <span className="calc-tab-hint">{t.hint}</span>
            </button>
          ))}
        </div>

        <div className="calc-panel card">
          {tab === 'scenarios' && (
            <ScenarioInput
              activeId={activeScenarioId}
              onLoad={loadScenario}
            />
          )}
          {tab === 'direct' && (
            <DirectInput
              counts={counts}
              updateCounts={updateCounts}
              onAnyChange={() => setActiveScenarioId(null)}
            />
          )}
          {tab === 'cases' && (
            <PerCaseInput
              applyCounts={(next) => { updateCounts(next); setActiveScenarioId(null) }}
            />
          )}
          {tab === 'csv' && (
            <CsvInput
              applyCounts={(next) => { updateCounts(next); setActiveScenarioId(null) }}
            />
          )}
        </div>
      </div>
    </section>
  )
}
