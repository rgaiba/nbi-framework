import React from 'react'

// Stacked fraction: numerator above a horizontal line, denominator below,
// optional multiplier (e.g. "× 100") trailing the fraction.
export default function Fraction({ num, den, mult }) {
  return (
    <span className="frac">
      <span className="frac-stack">
        <span className="frac-num">{num}</span>
        <span className="frac-line" />
        <span className="frac-den">{den}</span>
      </span>
      {mult && <span className="frac-mult">{mult}</span>}
    </span>
  )
}
