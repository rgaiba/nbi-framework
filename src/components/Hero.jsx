import React from 'react'

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="top" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="heroGrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#001e40"/>
              <stop offset="0.55" stopColor="#003068"/>
              <stop offset="1" stopColor="#004a90"/>
            </linearGradient>
            <pattern id="heroLines" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M0 36 L36 0" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#heroGrad)"/>
          <rect width="1200" height="600" fill="url(#heroLines)"/>
          {/* subtle ECG-like waveform reference, generic */}
          <polyline
            points="0,420 120,420 160,400 200,440 240,420 320,420 360,360 400,480 440,420 560,420 600,408 640,432 680,420 1200,420"
            stroke="rgba(255,255,255,0.10)" strokeWidth="1.6" fill="none"/>
        </svg>
      </div>

      <div className="container hero-content">
        <div className="hero-eyebrow">
          <span className="hero-dot" aria-hidden="true" />
          A Framework by Rahul Gaiba, MD
        </div>
        <h1 className="hero-title">
          When does AI <span className="hero-em">actually</span> change<br className="d-only" />
          a clinical decision&nbsp;—&nbsp;<span className="hero-italic">and was the change right?</span>
        </h1>
        <p className="hero-lede">
          The <strong>Net Beneficial Influence (NBI)</strong> framework quantifies the directional impact of
          any binary AI decision-support tool on expert decisions. It isolates AI&rsquo;s causal contribution
          to disagreement cases — the only cases where AI can exert influence — and adjudicates each
          decision change as <span className="chip chip-green">beneficial</span>,&nbsp;
          <span className="chip chip-red">harmful</span>, or appropriate resistance.
        </p>

        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => scrollTo('calculator')}>
            Try the calculator
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="btn btn-ghost" onClick={() => scrollTo('framework')}>
            Read the framework
          </button>
        </div>

        <div className="hero-meta">
          <div>
            <span className="hero-meta-k">Domain</span>
            <span className="hero-meta-v">Any binary AI clinical decision-support</span>
          </div>
          <div>
            <span className="hero-meta-k">Primary Metric</span>
            <span className="hero-meta-v">NBI = (B − H) / N<sub>disagree</sub> × 100</span>
          </div>
          <div>
            <span className="hero-meta-k">Version</span>
            <span className="hero-meta-v">1.0 · April 2026</span>
          </div>
        </div>
      </div>
    </section>
  )
}
