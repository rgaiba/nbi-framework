import React, { useState, useMemo, useCallback } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Walkthrough from './components/Walkthrough.jsx'
import Calculator from './components/Calculator/Calculator.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'
import { computeMetrics } from './lib/nbi.js'
import { SCENARIOS, DEFAULT_SCENARIO_ID } from './lib/scenarios.js'
import './styles/components.css'

export default function App() {
  // Single source of truth — all input modes write to {B, H, AR, IR}.
  const initial = SCENARIOS.find(s => s.id === DEFAULT_SCENARIO_ID).counts
  const [counts, setCounts] = useState(initial)
  const [activeScenarioId, setActiveScenarioId] = useState(DEFAULT_SCENARIO_ID)

  // Derived metrics — recomputed on every counts change.
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
      <a className="skip-link" href="#calculator">Skip to calculator</a>
      <Nav />
      <main>
        <Hero />
        <Walkthrough />
        <Calculator
          counts={counts}
          updateCounts={updateCounts}
          loadScenario={loadScenario}
          activeScenarioId={activeScenarioId}
          setActiveScenarioId={setActiveScenarioId}
        />
        <Dashboard counts={counts} metrics={metrics} />
        <About />
      </main>
      <Footer />
    </>
  )
}
