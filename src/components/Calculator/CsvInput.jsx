import React, { useState } from 'react'
import Papa from 'papaparse'
import { aggregateCases } from '../../lib/nbi.js'

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
  if (['1','yes','y','true','t','positive','pos','omi'].includes(s)) return 1
  if (['0','no','n','false','f','negative','neg','not omi'].includes(s)) return 0
  const n = Number(s)
  if (!Number.isNaN(n)) return n ? 1 : 0
  return null
}

export default function CsvInput({ applyCounts }) {
  const [parsed, setParsed] = useState(null)   // { rows, errors, fields }
  const [filename, setFilename] = useState('')
  const [pushed, setPushed] = useState(false)

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFilename(file.name)
    setPushed(false)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const fields = res.meta.fields || []
        const errors = []
        const rows = []
        const missing = REQUIRED.filter(c => !fields.includes(c))
        if (missing.length) {
          errors.push(`Missing required column(s): ${missing.join(', ')}. Required: ${REQUIRED.join(', ')}.`)
        }
        if (missing.length === 0) {
          res.data.forEach((r, i) => {
            const c = {}
            let bad = false
            for (const k of REQUIRED) {
              const v = coerceBinary(r[k])
              if (v === null) { bad = true; break }
              c[k] = v
            }
            if (bad) errors.push(`Row ${i + 1}: invalid binary value`)
            else rows.push(c)
          })
        }
        setParsed({ rows, errors, fields })
      },
      error: (err) => setParsed({ rows: [], errors: [err.message], fields: [] }),
    })
  }

  const apply = () => {
    if (!parsed?.rows.length) return
    const a = aggregateCases(parsed.rows)
    applyCounts({ B: a.B, H: a.H, IR: a.IR, AR: a.AR })
    setPushed(true)
  }

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'nbi_sample.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const agg = parsed?.rows.length ? aggregateCases(parsed.rows) : null

  return (
    <div className="csv-input">
      <p className="muted">
        Upload a CSV with one row per case. Required columns:&nbsp;
        <code>Di</code>, <code>A</code>, <code>Df</code>, <code>R</code> &nbsp;(binary 0/1, also accepts Yes/No, true/false).
        Extra columns (case_id, reader_id, site, etc.) are ignored — keep them for your records.
      </p>

      <div className="csv-actions">
        <label className="btn btn-primary btn-sm csv-upload-btn">
          Choose CSV file
          <input type="file" accept=".csv,text/csv" onChange={onFile} hidden />
        </label>
        <button className="btn btn-ghost btn-sm" onClick={downloadSample}>
          Download sample CSV
        </button>
        {filename && <span className="csv-filename muted">{filename}</span>}
      </div>

      {parsed && parsed.errors.length > 0 && (
        <div className="csv-errors">
          <strong>Issues:</strong>
          <ul>
            {parsed.errors.slice(0, 8).map((e, i) => <li key={i}>{e}</li>)}
            {parsed.errors.length > 8 && <li>…and {parsed.errors.length - 8} more</li>}
          </ul>
        </div>
      )}

      {agg && (
        <div className="csv-preview">
          <div className="csv-preview-row">
            <div><span className="muted">Total rows</span><strong>{agg.total}</strong></div>
            <div><span className="muted">Agreement (excluded)</span><strong>{agg.agreement}</strong></div>
            <div><span className="muted">Disagreement</span><strong>{agg.B + agg.H + agg.IR + agg.AR}</strong></div>
            <div><span className="muted">B</span><strong>{agg.B}</strong></div>
            <div><span className="muted">H</span><strong>{agg.H}</strong></div>
            <div><span className="muted">IR</span><strong>{agg.IR}</strong></div>
            <div><span className="muted">AR</span><strong>{agg.AR}</strong></div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={apply}>
            {pushed ? 'Applied ✓' : 'Apply to dashboard'}
          </button>
        </div>
      )}

      <details className="csv-format">
        <summary>CSV format details</summary>
        <pre>{SAMPLE_CSV}</pre>
        <p className="muted">
          <strong>Convention:</strong> 1 = positive class, 0 = negative. Rows where D₍ᵢ₎ = A are
          counted as agreement cases (excluded from N<sub>disagree</sub>). Rows with invalid values
          are listed under Issues and skipped.
        </p>
      </details>
    </div>
  )
}
