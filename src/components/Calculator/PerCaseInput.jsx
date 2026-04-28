import React, { useState, useMemo } from 'react'
import { aggregateCases, adjudicateCase } from '../../lib/nbi.js'

const BLANK_ROW = { Di: 0, A: 1, Df: 1, R: 1 }

const CLASS_LABEL = {
  B: 'Beneficial', H: 'Harmful', IR: 'Inapprop. resistance', AR: 'Approp. resistance', agreement: 'Agreement (excluded)',
}

export default function PerCaseInput({ applyCounts }) {
  const [rows, setRows] = useState([
    { Di: 0, A: 1, Df: 1, R: 1 }, // B
    { Di: 1, A: 0, Df: 0, R: 1 }, // H
    { Di: 0, A: 1, Df: 0, R: 1 }, // IR
    { Di: 1, A: 0, Df: 1, R: 1 }, // AR
  ])
  const [pushed, setPushed] = useState(false)

  const aggregate = useMemo(() => aggregateCases(rows), [rows])

  const updateRow = (idx, field, val) => {
    const v = Number(val) ? 1 : 0
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: v } : r))
    setPushed(false)
  }

  const addRow = () => { setRows(prev => [...prev, { ...BLANK_ROW }]); setPushed(false) }
  const removeRow = (idx) => { setRows(prev => prev.filter((_, i) => i !== idx)); setPushed(false) }
  const clearAll = () => { setRows([]); setPushed(false) }

  const apply = () => {
    applyCounts({
      B: aggregate.B, H: aggregate.H, IR: aggregate.IR, AR: aggregate.AR,
    })
    setPushed(true)
  }

  return (
    <div className="case-input">
      <p className="muted">
        Each row is a single case. Set the binary values for the initial decision (D₍ᵢ₎),
        AI output (A), final decision (D₍f₎), and reference standard (R). Each row is auto-classified
        into B, H, IR, AR, or excluded as an agreement case. Then apply to the dashboard.
      </p>

      <div className="case-table-wrap">
        <table className="case-table">
          <thead>
            <tr>
              <th>#</th>
              <th>D<sub>i</sub></th>
              <th>A</th>
              <th>D<sub>f</sub></th>
              <th>R</th>
              <th>Class</th>
              <th aria-label="Remove" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const cls = adjudicateCase(r)
              return (
                <tr key={i} className={`case-row case-row-${cls}`}>
                  <td className="muted">{i + 1}</td>
                  {['Di','A','Df','R'].map(field => (
                    <td key={field}>
                      <select
                        value={r[field]}
                        onChange={(e) => updateRow(i, field, e.target.value)}
                        aria-label={`${field} for case ${i + 1}`}
                      >
                        <option value="1">1</option>
                        <option value="0">0</option>
                      </select>
                    </td>
                  ))}
                  <td><span className={`class-pill class-${cls}`}>{CLASS_LABEL[cls]}</span></td>
                  <td>
                    <button className="row-x" aria-label={`Remove case ${i + 1}`} onClick={() => removeRow(i)}>×</button>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="muted center">No cases — add some below.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="case-actions">
        <button className="btn btn-ghost btn-sm" onClick={addRow}>+ Add case</button>
        <button className="btn btn-ghost btn-sm" onClick={clearAll}>Clear all</button>
        <div className="case-summary">
          <span><strong>{aggregate.total}</strong> cases</span>
          <span className="muted">·</span>
          <span><strong>{aggregate.agreement}</strong> excluded as agreement</span>
          <span className="muted">·</span>
          <span>
            <strong>{aggregate.B + aggregate.H + aggregate.IR + aggregate.AR}</strong> in disagreement
            &nbsp;(B {aggregate.B}, H {aggregate.H}, IR {aggregate.IR}, AR {aggregate.AR})
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={apply}>
          {pushed ? 'Applied ✓' : 'Apply to dashboard'}
        </button>
      </div>

      <div className="case-help muted">
        <strong>Convention:</strong> 1 = positive class (e.g. condition present), 0 = negative.
        Rows where D₍ᵢ₎ = A are agreement cases and contribute to none of the metrics.
      </div>
    </div>
  )
}
