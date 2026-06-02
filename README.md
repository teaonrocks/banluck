# Learn Banluck

A visual guide to **Banluck** (廿一點) — a Chinese blackjack-style card game. The site explains special hands, house rules, round flow, and Monte Carlo simulation results in plain language, with bilingual labels where helpful.

## What’s on the site

| Section | Topic |
| --- | --- |
| **Special hands** | The five premium hands (blackjack, pocket aces, triple 7s, five-card, five-card bust) with payouts and examples |
| **House rules** | Options that change play (15-run rules, minimum totals, player count) |
| **How to play** | Step-by-step round flow |
| **Simulation** | Filterable results from precomputed runs — banker vs player edge, win rates, and special-hand frequencies |
| **Assumptions** | Fixed player and banker hit/stand behavior used in the simulation |

Ruleset presets (standard, no 15 run, banker 15 only, all combos) sync across sections via shared context.

## Tech stack

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite 8](https://vite.dev) with the React Compiler enabled
- [Tailwind CSS 4](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com) and shadcn-style components

## Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- [pnpm](https://pnpm.io)

## Getting started

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Other scripts

| Command | Description |
| --- | --- |
| `pnpm build` | Type-check and production build to `dist/` |
| `pnpm build:with-sim` | Re-run simulation, then build (slow — ~minutes at default trials) |
| `pnpm preview` | Serve the production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm sim` | Run Monte Carlo simulation and write `src/data/results.json` |
| `pnpm sim:report` | Regenerate standalone HTML report from existing results |
| `pnpm sim:test` | Run simulation unit tests |

## Simulation data

The Monte Carlo engine lives in `sim/` — separate from the Vite app and not bundled into the site. Results are written to `src/data/results.json`, which the React app imports at build time.

```bash
# Default: 1000 trials × 36 rule configs
pnpm sim

# Fewer trials for a quick check
pnpm sim -- --trials 100

# Regenerate the standalone HTML table (written to sim/results.html)
pnpm sim:report
```

After changing house rules or simulation logic, run `pnpm sim` and commit the updated `results.json` if you want the site to reflect new numbers. Use `pnpm build:with-sim` when you want fresh data as part of a production build.

## Project layout

```
sim/                # Monte Carlo engine (Node-only, not bundled)
│   RULES.md        # Full rule assumptions (source of truth for the engine)
src/
├── components/     # UI, layout, and page sections
├── context/        # Ruleset preset state
├── data/           # Static copy + simulation results
├── hooks/          # Scroll spy, filters, ruleset helpers
└── types/          # Simulation result types
public/             # Favicon and static assets
```

## License

Private project — not published to npm (`"private": true` in `package.json`).
