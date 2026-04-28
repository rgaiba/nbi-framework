import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Rahul Gaiba, MD</span>
        <span aria-hidden="true">·</span>
        <span>Net Beneficial Influence Framework v1.0</span>
        <span aria-hidden="true">·</span>
        <span><code className="formula">nbi.rahulgaibamd.com</code></span>
      </div>
    </footer>
  )
}
