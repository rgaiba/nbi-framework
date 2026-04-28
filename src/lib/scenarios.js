// Pre-built scenarios that demonstrate how the NBI metrics behave under
// different reader-AI interaction patterns. Numbers are illustrative — sized
// so each pattern is visually distinct in the dashboard.

export const SCENARIOS = [
  {
    id: 'balanced',
    name: 'Balanced Reader',
    tagline: 'AI delivers clear net benefit.',
    description:
      'Clinician corrects most initial errors when AI flags them, and resists most incorrect AI suggestions on cases they got right. The intended deployment profile.',
    counts: { B: 28, H: 6, IR: 8, AR: 38 },
    accent: 'green',
  },
  {
    id: 'automation-bias',
    name: 'Automation-Bias-Prone Reader',
    tagline: 'AI drives net harm via over-trust.',
    description:
      'Clinician changes most decisions to match AI — including when AI is wrong. High DIR with low AIR. Net effect is negative because correct decisions get overwritten.',
    counts: { B: 18, H: 22, IR: 4, AR: 14 },
    accent: 'red',
  },
  {
    id: 'algorithm-aversion',
    name: 'Algorithm-Averse Reader',
    tagline: 'AI value nullified by under-trust.',
    description:
      'Clinician rarely changes their mind, even when the AI is correct. Low DIR overall, low ECR, high IR. The accuracy benefit of the model is left on the table.',
    counts: { B: 4, H: 1, IR: 22, AR: 33 },
    accent: 'amber',
  },
  {
    id: 'high-volume',
    name: 'High-Volume Site (Multi-Reader Aggregate)',
    tagline: 'Pooled across 12 readers, 600 cases.',
    description:
      'Aggregate counts across many readers and cases. Useful for site-level governance — variability between readers is hidden in the pooled view.',
    counts: { B: 142, H: 31, IR: 47, AR: 198 },
    accent: 'navy',
  },
  {
    id: 'null-effect',
    name: 'Null Effect',
    tagline: 'NBI ≈ 0 despite non-trivial activity.',
    description:
      'Beneficial and harmful changes occur in roughly equal numbers. NBI hovers near zero. A distinct governance finding — accuracy gain from algorithm exists, but is washed out at the human-AI level.',
    counts: { B: 12, H: 11, IR: 9, AR: 18 },
    accent: 'slate',
  },
  {
    id: 'tiny',
    name: 'Tiny Pilot (n=5)',
    tagline: 'How metrics behave at small N.',
    description:
      'Only a handful of disagreement cases. Helpful for showing the brittleness of percentage-based metrics at small sample sizes — useful pedagogically.',
    counts: { B: 2, H: 1, IR: 1, AR: 1 },
    accent: 'purple',
  },
]

export const DEFAULT_SCENARIO_ID = 'balanced'
