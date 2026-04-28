import React from 'react'

const CELLS = [
  { code: 'B',  name: 'Beneficial Change',         row: 0, col: 0, arrow: 'Wrong → Right',  cls: 'cell-b'  },
  { code: 'IR', name: 'Inappropriate Resistance',  row: 0, col: 1, arrow: 'Wrong → Wrong',  cls: 'cell-ir' },
  { code: 'H',  name: 'Harmful Change',            row: 1, col: 0, arrow: 'Right → Wrong',  cls: 'cell-h'  },
  { code: 'AR', name: 'Appropriate Resistance',    row: 1, col: 1, arrow: 'Right → Right',  cls: 'cell-ar' },
]

export default function OutcomesMatrix({ counts }) {
  const total = counts.B + counts.H + counts.IR + counts.AR
  const pct = (n) => total > 0 ? (100 * n / total) : 0

  return (
    <div className="outcomes-live">
      <div className="ol-grid">
        <div className="ol-col-empty">
          <span className="muted ol-axis-y">Initial Status</span>
        </div>
        <div className="ol-col-hdr">
          <strong>ΔD = 1</strong>
          <span className="muted">Decision changed</span>
        </div>
        <div className="ol-col-hdr">
          <strong>ΔD = 0</strong>
          <span className="muted">Decision unchanged</span>
        </div>

        <div className="ol-row-hdr ol-row-incorrect">
          <strong>Incorrect</strong>
          <span className="muted">D₍ᵢ₎ ≠ R</span>
        </div>
        <CellLive cell={CELLS[0]} count={counts.B}  pct={pct(counts.B)} />
        <CellLive cell={CELLS[1]} count={counts.IR} pct={pct(counts.IR)} />

        <div className="ol-row-hdr ol-row-correct">
          <strong>Correct</strong>
          <span className="muted">D₍ᵢ₎ = R</span>
        </div>
        <CellLive cell={CELLS[2]} count={counts.H}  pct={pct(counts.H)} />
        <CellLive cell={CELLS[3]} count={counts.AR} pct={pct(counts.AR)} />
      </div>

      <div className="ol-legend muted">
        Cell shading scales with frequency. Total disagreement cases:&nbsp;
        <strong>{total}</strong>
      </div>
    </div>
  )
}

function CellLive({ cell, count, pct }) {
  const intensity = Math.min(1, pct / 50) // saturates around 50%
  return (
    <div
      className={`ol-cell ${cell.cls}`}
      style={{ '--intensity': intensity.toFixed(2) }}
    >
      <div className="ol-cell-corner">{cell.code}</div>
      <div className="ol-cell-name">{cell.name}</div>
      <div className="ol-cell-arrow muted">{cell.arrow}</div>
      <div className="ol-cell-count">{count}</div>
      <div className="ol-cell-pct muted">{pct.toFixed(1)}%</div>
    </div>
  )
}
