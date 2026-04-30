import React, { useState, useMemo, useCallback } from 'react'
import Nav from './components/Nav.jsx'
import Calculator from './components/Calculator/Calculator.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'
import { computeMetrics } from './lib/nbi.js'

// Default counts on first load. Picks a "balanced reader" distribution so
// the dashboard isn't empty when the page opens.
const INITIAL_COUNTS = { B: 28, H: 6, IR: 8, AR: 38 }

export default function App() {
  // Two views: 'calculator' (home) and 'about'.
  const [view, setView] = useState('calculator')

  // Single source of truth for the calculator. All input modes write to {B, H, IR, AR}.
  const [counts, setCounts] = useState(INITIAL_COUNTS)

  const metrics = useMemo(() => computeMetrics(counts), [counts])

  const updateCounts = useCallback((next) => {
    setCounts(prev => ({ ...prev, ...next }))
  }, [])

  return (
    <>
      <Nav view={view} setView={setView} />
      <main className="main">
        <div className="container">
          {view === 'calculator' ? (
            <>
              <h1 className="calc-page-title">
                The Net Beneficial Influence Framework: Quantifying Cooperative Human-AI Decision-Making
              </h1>
              <div className="two-pane">
                <section className="pane pane-calculator" aria-label="Calculator inputs">
                  <Calculator
                    counts={counts}
                    updateCounts={updateCounts}
                  />
                </section>
                <section className="pane pane-dashboard" aria-label="Live metrics dashboard">
                  <Dashboard counts={counts} metrics={metrics} />
                </section>
              </div>
            </>
          ) : (
            <About />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
