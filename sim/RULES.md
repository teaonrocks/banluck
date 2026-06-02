# Banluck simulation rules

Encoded assumptions for the Monte Carlo engine in `sim/src/`. The public site summarizes these in the **Simulation assumptions** section (`src/data/assumptions.ts`).

## Deck and card values

| Rule | Assumption |
| --- | --- |
| Deck | Single 52-card deck, reshuffled each round |
| Ace | 1 or 11 — best non-bust total |
| Face cards | 10, J, Q, K = 10 |

## Payouts

| Hand | Condition | Multiplier |
| --- | --- | --- |
| Ban-Luck | First 2 cards = 21 (not pocket aces) | 2× |
| Ban-Ban | First 2 cards both aces | 3× |
| Triple 7 | Exactly 3 cards, all 7s | 7× |
| Gor-Leng | Exactly 5 cards, not bust | 2× |
| Five-card bust | 5th card causes bust | Lose 2× |
| Compare | Higher non-bust wins; bust loses; tie pushes | 1× |

When both sides have specials, the **highest single multiplier** wins; equal top multipliers push. Five-card bust is evaluated before special multiplier comparison.

## Round flow

1. Deal 2 cards to each player and banker  
2. **15 run** (if enabled) on opening two-card totals  
3. **2-card specials** (Ban-Ban / Ban-Luck) — instant settle  
4. **Players** act (minimum gate + strategy)  
5. **Banker soft 17** — open players with 3+ cards if banker already beats them  
6. **Banker hits** — open-before-hit loop  
7. **Settle** remaining hands (triple 7 only when `cards.length === 3` and all ranks are 7)

## Minimum (14 / 15 / 16)

Stand **gate**: cannot stand until `bestTotal > minimum` (e.g. minimum 14 → need ≥ 15). Forced hits during play; no opening forfeit.

Stand when above minimum and:

- Hard ≥ 17, or soft ≥ 18, or valid five-card hand  
- **Exception:** hard 16 with fewer than 5 cards — must keep hitting until 5 cards or bust  

## 15 run

| Variant | Behavior |
| --- | --- |
| `both` | Player opens 15 → push **that player only**. Banker opens 15 → push **all remaining** players. |
| `banker_only` | Only banker 15 pushes all players. Player 15 plays normally. |
| `none` | Disabled |

## Banker

- Same minimum gate and hit/stand rules as players (`strategy.ts`)  
- **Soft 17 open:** before hitting, settle any unresolved player with **3+ cards** if banker already beats them  
- **Open before hit:** busted player or banker total &gt; player → banker wins that hand (2× if five-card bust applies)  
- **Soft 17:** must hit while any unresolved player still has only two cards  

## Simulation grid

- **36 configs** = 3 `fifteenRun` × 3 `minimum` × 4 `players` (3, 5, 7, 10)  
- **100 rounds** per session (fixed; not a multi-length grid in current output)  
- **1,000 trials** per config by default (`--trials`, `--seed` on CLI)  
- Output: `src/data/results.json`, optional `sim/results.html` via `pnpm sim:report`  

## Source files

| File | Role |
| --- | --- |
| `cards.ts` | Deck, shuffle, rank values |
| `hand.ts` | Totals, specials, compare |
| `rules.ts` | House rule types and config grid |
| `strategy.ts` | `canStand`, `shouldHit`, `bankerShouldHit` |
| `round.ts` | Full round logic |
| `session.ts` | Multi-round stats |
| `simulate.ts` | Monte Carlo driver |

## Differences from early project notes

- Repo is **banluck-site** (Vite React app + `sim/`), not a standalone `banluck/` package.  
- **No `RULES.md` in root** until this file; assumptions also live in `src/data/assumptions.ts`.  
- **36 rows**, not 180 — session length is fixed at 100 rounds (no 10/30/50/70 grid in results).  
- **Banker win rate** is stored explicitly in results, not derived.  
- HTML report has filters and a collapsible assumptions block; **no heatmaps** in the current report generator.
