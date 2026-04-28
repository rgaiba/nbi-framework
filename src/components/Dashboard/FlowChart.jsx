import React from 'react'

const SEGMENTS = [
  { key: 'B',  label: 'Beneficial (B)',    cls: 'seg-b'  },
  { key: 'H',  label: 'Harmful (H)',       cls: 'seg-h'  },
  { key: 'IR', label: 'Inappropriate Resist. (IR)', cls: 'seg-ir' },
  { key: 'AR', label: 'Appropriate Resist. (AR)',   cls: 'seg-ar' },
]

export default function FlowChart({ counts, metrics }) {
  const total = counts.B + counts.H + counts.IR + counts.AR
  const pct = (n) => total > 0 ? (100 * n / total) : 0

  return (
    <div className="flow-chart">
      <div className="flow-bar" role="img" aria-label="Stacked composition of disagreement cases">
        {total === 0 ? (
          <div className="flow-empty muted">No disagreement cases yet.</div>
        ) : SEGMENTS.map(s => {
          const w = pct(counts[s.key])
          if (w === 0) return null
          return (
            <div
              key={s.key}
              className={`flow-seg ${s.cls}`}
              style={{ width: `${w}%` }}
              title={`${s.label}: ${counts[s.key]} (${w.toFixed(1)}%)`}
            >
              {w >= 8 && (
                <span className="flow-seg-label">
                  {s.key} · {counts[s.key]}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <ul className="flow-legend">
        {SEGMENTS.map(s => (
          <li key={s.key} className="flow-legend-item">
            <span className={`flow-legend-swatch ${s.cls}`} aria-hidden="true" />
            <span className="flow-legend-label">{s.label}</span>
            <span className="flow-legend-val">
              <strong>{counts[s.key]}</strong>
              <span className="muted">&nbsp;·&nbsp;{pct(counts[s.key]).toFixed(1)}%</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="flow-narratives">
        <Narrative
          metric="DIR"
          label="Changed decision"
          value={metrics.DIR}
          numerator={counts.B + counts.H}
          denominator={total}
          parts={[
            { cls: 'seg-b', label: 'Beneficial', val: counts.B },
            { cls: 'seg-h', label: 'Harmful',    val: counts.H },
          ]}
        />
        <Narrative
          metric="NBI"
          label="Net beneficial"
          value={metrics.NBI}
          numerator={counts.B - counts.H}
          denominator={total}
          parts={[
            { cls: 'seg-b', label: 'Beneficial', val: counts.B, sign: '+' },
            { cls: 'seg-h', label: 'Harmful',    val: counts.H, sign: '−' },
          ]}
          isPercent
        />
      </div>
    </div>
  )
}

function Narrative({ metric, label, value, numerator, denominator, parts, isPercent }) {
  return (
    <div className="flow-narr">
      <div className="flow-narr-head">
        <span className="flow-narr-metric">{metric}</span>
        <span className="muted">— {label}</span>
      </div>
      <div className="flow-narr-eq">
        <span className="flow-narr-num">
          {parts.map((p, i) => (
            <span key={i} className={`flow-narr-part ${p.cls}`}>
              {p.sign && <span className="flow-narr-sign">{p.sign}</span>}{p.val}
            </span>
          ))}
        </span>
        <span className="flow-narr-slash">/</span>
        <span className="flow-narr-den">{denominator}</span>
        <span className="flow-narr-eq-sign">=</span>
        <span className="flow-narr-result">
          {value === null || Number.isNaN(value)
            ? '—'
            : isPercent ? `${value.toFixed(1)}%` : value.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
