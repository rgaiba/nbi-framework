import React, { useState, useMemo, useCallback } from 'react'
import Nav from './components/Nav.jsx'
import Calculator from './components/Calculator/Calculator.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'
import { computeMetrics } from './lib/nbi.js'
import { SCENARIOS, DEFAULT_SCENARIO_ID } from './lib/scenarios.js'
import './styles/components.css'

export default function App() {
  // Two views: 'calculator' (home) and 'about'.
  const [view, setView] = useState('calculator')

  // Single source of truth for the calculator. All input modes write to {B, H, IR, AR}.
  const initial = SCENARIOS.find(s => s.id === DEFAULT_SCENARIO_ID).counts
  const [counts, setCounts] = useState(initial)
  const [activeScenarioId, setActiveScenarioId] = useState(DEFAULT_SCENARIO_ID)

  const metrics = useMemo(() => computeMetrics(counts), [counts])

  const updateCounts = useCallback((next) => {
    setCounts(prev => ({ ...prev, ...next }))
  }, [])

  const loadScenario = useCallback((scenarioId) => {
    const s = SCENARIOS.find(x => x.id === scenarioId)
    if (s) {
      setCounts(s.counts)
      setActiveScenarioId(s.id)
    }
  }, [])

  return (
    <>
      <Nav view={view} setView={setView} />
      <main className="main">
        <div className="container">
          {view === 'calculator' ? (
            <div className="two-pane">
              <section className="pane pane-dashboard" aria-label="Live metrics dashboard">
                <Dashboard counts={counts} metrics={metrics} />
              </section>
              <section className="pane pane-calculator" aria-label="Calculator inputs">
                <Calculator
                  counts={counts}
                  updateCounts={updateCounts}
                  loadScenario={loadScenario}
                  activeScenarioId={activeScenarioId}
                  setActiveScenarioId={setActiveScenarioId}
                />
              </section>
            </div>
          ) : (
            <About />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
