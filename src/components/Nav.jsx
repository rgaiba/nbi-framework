import React from 'react'

export default function Nav({ view, setView }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <button
          className="nav-brand"
          onClick={() => setView('calculator')}
          aria-label="Net Beneficial Influence, go to calculator"
        >
          <span className="nav-mark">NBI</span>
          <span className="nav-divider" aria-hidden="true" />
          <span className="nav-wordmark">Net Beneficial Influence</span>
        </button>
        <nav className="nav-tabs" aria-label="Primary">
          <button
            className={`nav-tab ${view === 'calculator' ? 'is-active' : ''}`}
            onClick={() => setView('calculator')}
            aria-current={view === 'calculator' ? 'page' : undefined}
          >
            Calculator
          </button>
          <button
            className={`nav-tab ${view === 'about' ? 'is-active' : ''}`}
            onClick={() => setView('about')}
            aria-current={view === 'about' ? 'page' : undefined}
          >
            About
          </button>
        </nav>
      </div>
    </header>
  )
}
