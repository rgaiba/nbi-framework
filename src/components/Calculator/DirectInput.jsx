import React from 'react'

const FIELDS = [
  { key: 'B',  label: 'Beneficial Change',         hint: 'Wrong → Right (Correct₍ᵢ₎=0, ΔD=1)', cls: 'cell-b'  },
  { key: 'H',  label: 'Harmful Change',            hint: 'Right → Wrong (Correct₍ᵢ₎=1, ΔD=1)', cls: 'cell-h'  },
  { key: 'IR', label: 'Inappropriate Resistance',  hint: 'Wrong → Wrong (Correct₍ᵢ₎=0, ΔD=0)', cls: 'cell-ir' },
  { key: 'AR', label: 'Appropriate Resistance',    hint: 'Right → Right (Correct₍ᵢ₎=1, ΔD=0)', cls: 'cell-ar' },
]

export default function DirectInput({ counts, updateCounts, onAnyChange }) {
  const handle = (key, raw) => {
    const v = Math.max(0, Math.floor(Number(raw) || 0))
    updateCounts({ [key]: v })
    if (onAnyChange) onAnyChange()
  }

  const reset = () => {
    updateCounts({ B: 0, H: 0, IR: 0, AR: 0 })
    if (onAnyChange) onAnyChange()
  }

  return (
    <div className="direct-input">
      <div className="direct-header">
        <p className="muted">
          Adjust each cell of the 2×2 matrix directly. Use the sliders for quick exploration or
          type values for precision. Counts are integers ≥ 0.
        </p>
        <button className="btn btn-ghost btn-sm" onClick={reset}>Reset to zero</button>
      </div>

      <div className="direct-grid">
        {FIELDS.map(f => (
          <div key={f.key} className={`direct-field ${f.cls}`}>
            <label htmlFor={`f-${f.key}`}>
              <span className="direct-key">{f.key}</span>
              <span className="direct-label">{f.label}</span>
            </label>
            <div className="direct-controls">
              <input
                id={`f-${f.key}`}
                type="number"
                min="0"
                step="1"
                value={counts[f.key]}
                onChange={(e) => handle(f.key, e.target.value)}
                className="direct-num"
              />
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={Math.min(200, counts[f.key])}
                onChange={(e) => handle(f.key, e.target.value)}
                className="direct-range"
                aria-label={`${f.label} slider`}
              />
            </div>
            <div className="direct-hint">{f.hint}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
