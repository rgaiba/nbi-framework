import React from 'react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="foot-row">
          <div className="foot-brand">
            <div className="foot-mark" aria-hidden="true">NBI</div>
            <div>
              <div className="foot-title">Net Beneficial Influence Framework</div>
              <div className="muted">
                Evaluating cooperative human-AI clinical decision-making.
              </div>
            </div>
          </div>
          <div className="foot-meta muted">
            © {new Date().getFullYear()} Rahul Gaiba, MD&nbsp;&nbsp;·&nbsp;&nbsp;Version 1.0&nbsp;&nbsp;·&nbsp;&nbsp;<code className="formula">nbi.rahulgaibamd.com</code>
          </div>
        </div>
      </div>
    </footer>
  )
}
