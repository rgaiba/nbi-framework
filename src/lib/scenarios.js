// Pre-built outcome distributions illustrating common reader-AI interaction patterns.
// Each is sized so its NBI signature is visually distinct in the dashboard.

export const SCENARIOS = [
  {
    id: 'balanced',
    name: 'Balanced reader',
    tagline: 'Net benefit',
    counts: { B: 28, H: 6, IR: 8, AR: 38 },
  },
  {
    id: 'automation-bias',
    name: 'Automation-bias-prone reader',
    tagline: 'Net harm via over-trust',
    counts: { B: 18, H: 22, IR: 4, AR: 14 },
  },
  {
    id: 'algorithm-aversion',
    name: 'Algorithm-averse reader',
    tagline: 'Value left on the table',
    counts: { B: 4, H: 1, IR: 22, AR: 33 },
  },
  {
    id: 'null-effect',
    name: 'Null effect',
    tagline: 'NBI ≈ 0 despite activity',
    counts: { B: 12, H: 11, IR: 9, AR: 18 },
  },
]

export const DEFAULT_SCENARIO_ID = 'balanced'
