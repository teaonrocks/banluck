import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  allConfigs,
  configLabel,
  type SimConfig,
} from './rules.js';
import {
  playSession,
  sessionBankerUnitsPerRoundPerPlayer,
  sessionBankerWinRate,
  sessionPlayerWinRate,
  type SessionStats,
} from './session.js';
import { generateHtml } from './report-html.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '../..');
const SIM_ROOT = join(__dirname, '..');

export interface StatSummary {
  mean: number;
  std: number;
  ci95: [number, number];
}

export interface ConfigResult {
  config: SimConfig;
  label: string;
  bankerUnitsPerRoundPerPlayer: StatSummary;
  playerWinRate: StatSummary;
  bankerWinRate: StatSummary;
  pushRate: number;
  pushedRoundRate: number;
  specialRates: {
    blackjack: number;
    pocketAces: number;
    triple7: number;
    fiveCard: number;
    fiveCardBust: number;
  };
}

export interface SimOutput {
  meta: {
    trials: number;
    seed: number;
    generatedAt: string;
    rulesVersion: string;
  };
  results: ConfigResult[];
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function summarize(values: number[]): StatSummary {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const variance =
    values.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, n - 1);
  const std = Math.sqrt(variance);
  const margin = 1.96 * (std / Math.sqrt(n));
  return {
    mean,
    std,
    ci95: [mean - margin, mean + margin],
  };
}

function parseArgs(): { trials: number; seed: number } {
  let trials = 1000;
  let seed = 42;
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--trials' && args[i + 1]) {
      trials = parseInt(args[++i], 10);
    } else if (args[i] === '--seed' && args[i + 1]) {
      seed = parseInt(args[++i], 10);
    }
  }
  return { trials, seed };
}

function runConfig(
  config: SimConfig,
  trials: number,
  baseSeed: number
): ConfigResult {
  const bankerUnits: number[] = [];
  const playerWinRates: number[] = [];
  const bankerWinRates: number[] = [];
  const agg: SessionStats = {
    totalBankerDelta: 0,
    totalPlayerRounds: 0,
    playerWins: 0,
    playerLosses: 0,
    pushes: 0,
    pushedRounds: 0,
    specials: {
      blackjack: 0,
      pocketAces: 0,
      triple7: 0,
      fiveCard: 0,
      fiveCardBust: 0,
    },
  };

  for (let t = 0; t < trials; t++) {
    const random = mulberry32(baseSeed + t * 9973 + hashConfig(config));
    const session = playSession(
      config.players,
      config.rounds,
      config,
      random
    );
    bankerUnits.push(sessionBankerUnitsPerRoundPerPlayer(session));
    playerWinRates.push(sessionPlayerWinRate(session));
    bankerWinRates.push(sessionBankerWinRate(session));

    agg.totalBankerDelta += session.totalBankerDelta;
    agg.totalPlayerRounds += session.totalPlayerRounds;
    agg.playerWins += session.playerWins;
    agg.playerLosses += session.playerLosses;
    agg.pushes += session.pushes;
    agg.pushedRounds += session.pushedRounds;
    for (const k of Object.keys(agg.specials) as (keyof typeof agg.specials)[]) {
      agg.specials[k] += session.specials[k];
    }
  }

  const totalRounds = trials * config.rounds;
  const totalPlayerRounds = agg.totalPlayerRounds;

  return {
    config,
    label: configLabel(config),
    bankerUnitsPerRoundPerPlayer: summarize(bankerUnits),
    playerWinRate: summarize(playerWinRates),
    bankerWinRate: summarize(bankerWinRates),
    pushRate: totalPlayerRounds > 0 ? agg.pushes / totalPlayerRounds : 0,
    pushedRoundRate: totalRounds > 0 ? agg.pushedRounds / totalRounds : 0,
    specialRates: {
      blackjack:
        totalPlayerRounds > 0 ? agg.specials.blackjack / totalPlayerRounds : 0,
      pocketAces:
        totalPlayerRounds > 0 ? agg.specials.pocketAces / totalPlayerRounds : 0,
      triple7:
        totalPlayerRounds > 0 ? agg.specials.triple7 / totalPlayerRounds : 0,
      fiveCard:
        totalPlayerRounds > 0 ? agg.specials.fiveCard / totalPlayerRounds : 0,
      fiveCardBust:
        totalPlayerRounds > 0
          ? agg.specials.fiveCardBust / totalPlayerRounds
          : 0,
    },
  };
}

function hashConfig(c: SimConfig): number {
  return (
    c.fifteenRun.charCodeAt(0) * 1000 +
    c.minimum * 100 +
    c.players * 10 +
    c.rounds
  );
}

function main(): void {
  const { trials, seed } = parseArgs();
  const configs = allConfigs();
  const results: ConfigResult[] = [];

  console.log(`Running ${configs.length} configs × ${trials} trials...`);

  for (let i = 0; i < configs.length; i++) {
    const config = configs[i];
    results.push(runConfig(config, trials, seed));
    if ((i + 1) % 20 === 0 || i === configs.length - 1) {
      console.log(`  ${i + 1}/${configs.length} done`);
    }
  }

  const output: SimOutput = {
    meta: {
      trials,
      seed,
      generatedAt: new Date().toISOString(),
      rulesVersion: '1.0',
    },
    results,
  };

  const jsonPath = join(PROJECT_ROOT, 'src/data/results.json');
  writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${jsonPath}`);

  const htmlPath = join(SIM_ROOT, 'results.html');
  writeFileSync(htmlPath, generateHtml(output));
  console.log(`Wrote ${htmlPath}`);
}

main();
