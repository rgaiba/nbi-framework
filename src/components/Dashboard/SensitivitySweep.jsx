import React, { useState, useMemo } from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts'
import { computeMetrics } from '../../lib/nbi.js'

const VARS = [
  { key: 'B',  label: 'Sweep B  (Beneficial)' },
  { key: 'H',  label: 'Sweep H  (Harmful)' },
  { key: 'IR', label: 'Sweep IR (Inappropriate Resistance)' },
  { key: 'AR', label: 'Sweep AR (Appropriate Resistance)' },
]

const METRIC_OPTS = [
  { key: 'NBI', stroke: '#002f5e', show: true },
  { key: 'AIR', stroke: '#d99a28', show: true, scale: 100 }, // AIR is 0–1, scale to %
  { key: 'ECR', stroke: '#16703a', show: true },
  { key: 'EIR', stroke: '#b01818', show: true },
  { key: 'DIR', stroke: '#5a2090', show: true },
]

function formatTick(value) {
  return `${Math.round(value)}`
}

export default function SensitivitySweep({ counts }) {
  const [varKey, setVarKey] = useState('H')
  const [maxVal, setMaxVal] = useState(50)
  const [shown, setShown] = useState(['NBI', 'AIR', 'ECR', 'EIR', 'DIR'])

  const data = useMemo(() => {
    const rows = []
    for (let v = 0; v <= maxVal; v++) {
      const c = { ...counts, [varKey]: v }
      const m = computeMetrics(c)
      rows.push({
        x: v,
        NBI: m.NBI,
        AIR: m.AIR === null ? null : m.AIR * 100, // display AIR as % too for shared y-axis
        ECR: m.ECR,
        EIR: m.EIR,
        DIR: m.DIR,
      })
    }
    return rows
  }, [counts, varKey, maxVal])

  const toggle = (k) => setShown(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k])

  return (
    <div className="sweep">
      <div className="sweep-controls">
        <div className="sweep-control-group">
          <label htmlFor="sweep-var">Variable</label>
          <select id="sweep-var" value={varKey} onChange={(e) => setVarKey(e.target.value)}>
            {VARS.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
          </select>
        </div>
        <div className="sweep-control-group">
          <label htmlFor="sweep-max">Max value: <strong>{maxVal}</strong></label>
          <input
            id="sweep-max"
            type="range"
            min="10"
            max="200"
            step="5"
            value={maxVal}
            onChange={(e) => setMaxVal(Number(e.target.value))}
          />
        </div>
        <div className="sweep-control-group sweep-toggles">
          {METRIC_OPTS.map(m => (
            <label key={m.key} className={`sweep-toggle ${shown.includes(m.key) ? 'is-on' : ''}`}>
              <input
                type="checkbox"
                checked={shown.includes(m.key)}
                onChange={() => toggle(m.key)}
              />
              <span className="sweep-toggle-swatch" style={{ background: m.stroke }} />
              {m.key}
            </label>
          ))}
        </div>
      </div>

      <div className="sweep-chart">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#dde4ed" strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              stroke="#657890"
              tick={{ fill: '#38485e', fontSize: 12 }}
              label={{ value: `${varKey}`, position: 'insideBottom', offset: -4, fill: '#38485e', fontSize: 12 }}
            />
            <YAxis
              stroke="#657890"
              tick={{ fill: '#38485e', fontSize: 12 }}
              tickFormatter={formatTick}
              domain={[(min) => Math.min(0, Math.floor(min)), (max) => Math.max(100, Math.ceil(max))]}
              label={{ value: 'Metric value (%)', angle: -90, position: 'insideLeft', fill: '#38485e', fontSize: 12, dy: 60 }}
            />
            <Tooltip
              contentStyle={{ background: 'white', border: '1px solid #c4d0de', borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => v === null ? ['—', name] : [v.toFixed(1), name === 'AIR' ? 'AIR (×100)' : name]}
              labelFormatter={(x) => `${varKey} = ${x}`}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={0} stroke="#657890" strokeDasharray="2 2" />
            {METRIC_OPTS.filter(m => shown.includes(m.key)).map(m => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                stroke={m.stroke}
                strokeWidth={2}
                dot={false}
                connectNulls={false}
                isAnimationActive={false}
                name={m.key === 'AIR' ? 'AIR (×100)' : m.key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="sweep-help muted">
        AIR is shown ×100 so it shares the same y-axis as the other (percentage) metrics.
        Other counts are held constant at the calculator&rsquo;s current values
        ({['B','H','IR','AR'].filter(k => k !== varKey).map(k => `${k}=${counts[k]}`).join(', ')}).
      </p>
    </div>
  )
}
