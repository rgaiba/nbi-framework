import React from 'react'

const FIELDS = [
  { k: 'B',  label: 'Beneficial change',         hint: 'Wrong → Right',   cls: 'field-b'  },
  { k: 'H',  label: 'Harmful change',            hint: 'Right → Wrong',   cls: 'field-h'  },
  { k: 'IR', label: 'Inappropriate resistance',  hint: 'Wrong → Wrong',   cls: 'field-ir' },
  { k: 'AR', label: 'Appropriate resistance',    hint: 'Right → Right',   cls: 'field-ar' },
]

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

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

  // Random sample biased toward realistic-looking distributions: more AR than H,
  // moderate B, modest IR. Adds visual variety without producing nonsense.
  const sample = () => {
    updateCounts({
      B:  rand(8, 35),
      H:  rand(2, 18),
      IR: rand(3, 20),
      AR: rand(15, 45),
    })
    if (onAnyChange) onAnyChange()
  }

  return (
    <div className="direct">
      <p className="muted">
        Set the four outcome counts directly. Updates the dashboard live.
      </p>

      <dl className="legend-grid">
        <dt>B</dt>  <dd>Beneficial change · Wrong → Right</dd>
        <dt>H</dt>  <dd>Harmful change · Right → Wrong</dd>
        <dt>IR</dt> <dd>Inappropriate resistance · Wrong → Wrong</dd>
        <dt>AR</dt> <dd>Appropriate resistance · Right → Right</dd>
      </dl>

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

      <div className="direct-actions">
        <button className="btn btn-ghost btn-sm" onClick={reset}>Reset</button>
        <button className="btn btn-ghost btn-sm" onClick={sample}>Random Sample</button>
      </div>
    </div>
  )
}
