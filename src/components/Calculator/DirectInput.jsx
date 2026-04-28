import React from 'react'

const FIELDS = [
  { k: 'B',  label: 'Beneficial change',         hint: 'Wrong → Right',   cls: 'field-b'  },
  { k: 'H',  label: 'Harmful change',            hint: 'Right → Wrong',   cls: 'field-h'  },
  { k: 'IR', label: 'Inappropriate resistance',  hint: 'Wrong → Wrong',   cls: 'field-ir' },
  { k: 'AR', label: 'Appropriate resistance',    hint: 'Right → Right',   cls: 'field-ar' },
]

export default function DirectInput({ counts, updateCounts, onAnyChange }) {
  const handle = (k, raw) => {
    const v = Math.max(0, Math.floor(Number(raw) || 0))
    updateCounts({ [k]: v })
    if (onAnyChange) onAnyChange()
  }

  const reset = () => {
    updateCounts({ B: 0, H: 0, IR: 0, AR: 0 })
    if (onAnyChange) onAnyChange()
  }

  return (
    <div className="direct">
      <p className="muted">Set the four outcome counts directly. Updates the dashboard live.</p>
      <div className="direct-fields">
        {FIELDS.map(f => (
          <div key={f.k} className={`direct-row ${f.cls}`}>
            <div className="direct-meta">
              <div className="direct-label">{f.k} · {f.label}</div>
              <div className="direct-hint">{f.hint}</div>
            </div>
            <input
              type="number"
              min="0"
              step="1"
              value={counts[f.k]}
              onChange={(e) => handle(f.k, e.target.value)}
              className="direct-num"
              aria-label={f.label}
            />
          </div>
        ))}
      </div>
      <button className="btn btn-ghost btn-sm direct-reset" onClick={reset}>Reset to zero</button>
    </div>
  )
}
