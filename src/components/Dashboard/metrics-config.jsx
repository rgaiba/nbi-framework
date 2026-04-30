import React from 'react'
import Chip from '../shared/Chip.jsx'

// Configuration for the four secondary metric cards. Order is DIR, AIR,
// ECR, EIR. Only DIR uses the two-line formula layout (its expression is
// the only one that doesn't fit on a single line in a 2x2 grid card).
// `desc` is a static description of what the metric measures, parallel
// in tone to the NBI hero's interpretation line.
export const SECONDARY_METRICS = [
  {
    k: 'DIR',
    expansion: 'Decision Influence Rate',
    formula: (<>(<Chip k="B" /> + <Chip k="H" />) / N<sub>disagree</sub> × 100</>),
    twoLine: true,
    desc: 'Overall rate of decision change among disagreement cases.',
  },
  {
    k: 'AIR',
    expansion: 'Appropriate Influence Ratio',
    formula: (<><Chip k="B" /> / (<Chip k="B" /> + <Chip k="H" />)</>),
    desc: 'Proportion of AI-driven decision changes that were beneficial.',
  },
  {
    k: 'ECR',
    expansion: 'Error Correction Rate',
    formula: (<><Chip k="B" /> / (<Chip k="B" /> + <Chip k="IR" />) × 100</>),
    desc: 'Proportion of clinician errors corrected after the AI nudge.',
  },
  {
    k: 'EIR',
    expansion: 'Error Induction Rate',
    formula: (<><Chip k="H" /> / (<Chip k="H" /> + <Chip k="AR" />) × 100</>),
    desc: 'Proportion of correct decisions converted to errors after the AI nudge.',
  },
]
