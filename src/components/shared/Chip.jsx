import React from 'react'

// Inline colored variable chip used across the app (formulas, matrices,
// signature cards, direct input). The k prop is one of B, H, IR, AR.
export default function Chip({ k }) {
  return <span className={`def-chip def-chip-${k}`}>{k}</span>
}
