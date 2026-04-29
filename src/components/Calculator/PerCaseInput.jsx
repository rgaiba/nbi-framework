import React, { useState, useMemo } from 'react'
import Papa from 'papaparse'
import { aggregateCases, adjudicateCase } from '../../lib/nbi.js'

const BLANK_ROW = { Di: 0, A: 1, Df: 1, R: 1 }

const CLASS_LABEL = {
  B: 'B',
  H: 'H',
  IR: 'IR',
  AR: 'AR',
  agreement: 'Agree · excluded',
}

const REQUIRED = ['Di', 'A', 'Df', 'R']
const SAMPLE_CSV = `case_id,Di,A,Df,R
1,0,1,1,1
2,1,0,0,1
3,0,1,0,1
4,1,0,1,1
5,1,1,1,1
6,0,0,0,0
`

function coerceBinary(v) {
  if (v === undefined || v === null) return null
  const s = String(v).trim().toLowerCase()
  if (['1','yes','y','true','t'].includes(s)) return 1
  if (['0','no','n','false','f'].includes(s)) return 0
  const n = Number(s)
  if (!Number.isNaN(n)) return n ? 1 : 0
  return null
}

export default function PerCaseInput({ applyCounts }) {
  const [rows, setRows] = useState([
    { Di: 0, A: 1, Df: 1, R: 1 }, // B
    { Di: 1, A: 0, Df: 0, R: 1 }, // H
    { Di: 0, A: 1, Df: 0, R: 1 }, // IR
    { Di: 1, A: 0, Df: 1, R: 1 }, // AR
  ])
  const [csvErrors, setCsvErrors] = useState([])
  const [csvFilename, setCsvFilename] = useState('')
  const [pushed, setPushed] = useState(false)

  const aggregate = useMemo(() => aggregateCases(rows), [rows])

  const updateRow = (idx, field, val) => {
    const v = Number(val) ? 1 : 0
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: v } : r))
    setPushed(false)
  }
  const addRow = () => { setRows(prev => [...prev, { ...BLANK_ROW }]); setPushed(false) }
  const removeRow = (idx) => { setRows(prev => prev.filter((_, i) => i !== idx)); setPushed(false) }
  const clearAll = () => { setRows([]); setPushed(false); setCsvErrors([]); setCsvFilename('') }

  const apply = () => {
    applyCounts({ B: aggregate.B, H: aggregate.H, IR: aggregate.IR, AR: aggregate.AR })
    setPushed(true)
  }

  const onCsv = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFilename(file.name)
    setCsvErrors([])
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const fields = res.meta.fields || []
        const errors = []
        const newRows = []
        const missing = REQUIRED.filter(c => !fields.includes(c))
        if (missing.length) {
          errors.push(`Missing required column(s): ${missing.join(', ')}.`)
        } else {
          res.data.forEach((r, i) => {
            const c = {}
            let bad = false
            for (const k of REQUIRED) {
              const v = coerceBinary(r[k])
              if (v === null) { bad = true; break }
              c[k] = v
            }
            if (bad) errors.push(`Row ${i + 1}: invalid binary value`)
            else newRows.push(c)
          })
        }
        setCsvErrors(errors)
        if (newRows.length > 0) {
          setRows(newRows)
          setPushed(false)
        }
        e.target.value = ''
      },
      error: (err) => {
        setCsvErrors([err.message])
        e.target.value = ''
      },
    })
  }

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'nbi_sample.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const totalDis = aggregate.B + aggregate.H + aggregate.IR + aggregate.AR

  return (
    <div className="cases">
      <p className="muted">
        Add cases one by one. Each row is auto-classified as soon as all four
        values are set. Click Apply to push the totals to the dashboard.
      </p>

      <div className="legend-box">
        <dl className="legend-grid legend-grid-2col">
          <dt>D<sub>i</sub></dt> <dd>Clinician's initial decision</dd>
          <dt>A</dt>             <dd>AI's recommendation</dd>
          <dt>D<sub>f</sub></dt> <dd>Clinician's final decision</dd>
          <dt>R</dt>             <dd>Reference standard. Binary 0/1.</dd>
        </dl>
        <div className="legend-agreement">
          Agreement cases (D<sub>i</sub> = A) are adjudicated but excluded from N<sub>disagree</sub>.
        </div>
      </div>

      <div className="cases-table-wrap">
        <table className="cases-table">
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
              <tr><td colSpan={7} className="muted center">No cases.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="cases-actions">
        <button className="btn btn-ghost btn-sm" onClick={addRow}>+ Add case</button>
        <button className="btn btn-ghost btn-sm" onClick={clearAll}>Clear all</button>
        <div className="cases-summary muted">
          <strong>{aggregate.total}</strong> cases · <strong>{aggregate.agreement}</strong> agreement · <strong>{totalDis}</strong> disagreement
        </div>
        <button className="btn btn-primary btn-sm" onClick={apply}>
          {pushed ? 'Applied ✓' : 'Apply'}
        </button>
      </div>

      <div className="cases-csv">
        <div className="cases-csv-head">Or upload many cases at once</div>
        <div className="cases-csv-actions">
          <label className="btn btn-ghost btn-sm csv-upload-label">
            Upload CSV
            <input type="file" accept=".csv,text/csv" onChange={onCsv} hidden />
          </label>
          <button className="btn btn-ghost btn-sm" onClick={downloadSample}>Sample CSV</button>
          {csvFilename && <span className="csv-name muted">{csvFilename}</span>}
          <span className="muted csv-hint">Columns: D<sub>i</sub>, A, D<sub>f</sub>, R</span>
        </div>
        {csvErrors.length > 0 && (
          <div className="csv-errors" role="alert">
            <strong>Issues:</strong>
            <ul>
              {csvErrors.slice(0, 5).map((e, i) => <li key={i}>{e}</li>)}
              {csvErrors.length > 5 && <li>and {csvErrors.length - 5} more</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
