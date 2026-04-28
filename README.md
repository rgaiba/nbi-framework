# NBI Framework — Interactive Demo

The **Net Beneficial Influence (NBI) Framework** quantifies the directional impact of any binary AI clinical decision-support tool on expert decisions. This site is a public, interactive demonstration of the framework, built as a single-page React app and deployed as static files via GitHub Pages.

**Live demo:** https://nbi.rahulgaibamd.com (once DNS is configured)
**Originator:** Rahul Gaiba, MD — Version 1.0, April 2026

## What it does

- Walks through the four-step operational sequence of NBI.
- Renders the 2 × 2 adjudication matrix (B / H / IR / AR) live.
- Computes all five canonical metrics — **NBI · AIR · ECR · EIR · DIR** — in real time from any of four input modes.
- Includes a sensitivity sweep so users can see how each metric responds to a single perturbed count.

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

## Production build

```bash
npm run build        # outputs to ./dist
npm run preview      # local preview of the built bundle
```

## Deployment to GitHub Pages

This repo is configured to deploy automatically on every push to `main` via the workflow at `.github/workflows/deploy.yml`. To enable it the first time:

1. Push the repo to GitHub.
2. In the repo, go to **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The first push to `main` will build and publish the site at `https://<your-username>.github.io/<repo-name>` (or the custom domain below).

### Custom subdomain — `nbi.rahulgaibamd.com`

The `public/CNAME` file contains `nbi.rahulgaibamd.com` and Vite will copy it into the build output, so GitHub Pages will pick it up automatically.

To wire the DNS at your registrar (where `rahulgaibamd.com` lives), add a **CNAME** record:

| Host  | Type  | Value                            |
| ----- | ----- | -------------------------------- |
| `nbi` | CNAME | `<your-github-username>.github.io` |

After DNS propagates (usually < 1 hour), GitHub Pages will provision an HTTPS certificate automatically. In **Settings → Pages**, the "Custom domain" field should show `nbi.rahulgaibamd.com` with a green check, and "Enforce HTTPS" should be enabled.

> **Note**: `vite.config.js` sets `base: '/'` because the site is served at the root of a custom domain. If you ever decide to host without a custom domain (e.g. at `username.github.io/nbi-website`), change `base` to `'/nbi-website/'` and rebuild.

## Project structure

```
src/
├── App.jsx                      # composition + global state
├── main.jsx
├── components/
│   ├── Nav.jsx                  # sticky, mobile-friendly nav
│   ├── Hero.jsx                 # title + lede + CTA
│   ├── Walkthrough.jsx          # 4-step framework explainer + 2x2 + formulas
│   ├── About.jsx                # framework provenance, citation
│   ├── Footer.jsx
│   ├── Calculator/
│   │   ├── Calculator.jsx       # tabbed input chooser
│   │   ├── ScenarioInput.jsx    # pre-built reader profiles
│   │   ├── DirectInput.jsx      # B/H/IR/AR sliders + numbers
│   │   ├── PerCaseInput.jsx     # row-by-row Di/A/Df/R input
│   │   └── CsvInput.jsx         # CSV upload + papaparse
│   └── Dashboard/
│       ├── Dashboard.jsx
│       ├── MetricCards.jsx      # 5 metric cards
│       ├── OutcomesMatrix.jsx   # live 2x2 with intensity shading
│       ├── FlowChart.jsx        # stacked-bar decomposition
│       └── SensitivitySweep.jsx # Recharts line chart
├── lib/
│   ├── nbi.js                   # core math: adjudication + metrics
│   └── scenarios.js             # preset reader profiles
└── styles/
    ├── theme.css                # design tokens, fluid typography
    └── components.css           # all component styles
```

## Math reference

```
N_disagree = B + H + AR + IR

NBI = (B − H) / N_disagree × 100        ← primary
AIR = B / (B + H)
ECR = B / (B + IR) × 100
EIR = H / (H + AR) × 100
DIR = (B + H) / N_disagree × 100
```

## Citation

> Gaiba R. *The Net Beneficial Influence Framework: Quantifying Cooperative Human-AI Decision-Making.* Version 1.0. April 2026. nbi.rahulgaibamd.com

## License

© Rahul Gaiba, MD. All rights reserved.
