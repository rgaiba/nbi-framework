import React, { useEffect, useState } from 'react'

const LINKS = [
  { id: 'framework', label: 'Framework' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'dashboard',  label: 'Dashboard' },
  { id: 'about',      label: 'About' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="nav-brand" onClick={(e) => handleClick(e, 'top')}>
          <span className="nav-mark" aria-hidden="true">NBI</span>
          <span className="nav-title">
            <span className="nav-title-main">Net Beneficial Influence</span>
            <span className="nav-title-sub">Framework · Interactive Demo</span>
          </span>
        </a>

        <nav className={`nav-links ${open ? 'nav-links--open' : ''}`} aria-label="Primary">
          {LINKS.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => handleClick(e, l.id)}>
              {l.label}
            </a>
          ))}
        </nav>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
