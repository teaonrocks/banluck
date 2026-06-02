export type FifteenRun = 'both' | 'banker_only' | 'none';
export type Minimum = 14 | 15 | 16;

export interface HouseRules {
  fifteenRun: FifteenRun;
  minimum: Minimum;
}

export interface SimConfig extends HouseRules {
  players: 3 | 5 | 7 | 10;
  rounds: 100;
}

export const FIFTEEN_RUNS: FifteenRun[] = ['both', 'banker_only', 'none'];
export const MINIMUMS: Minimum[] = [14, 15, 16];
export const PLAYER_COUNTS = [3, 5, 7, 10] as const;
export const ROUND_COUNTS = [100] as const;

export function allConfigs(): SimConfig[] {
  const configs: SimConfig[] = [];
  for (const fifteenRun of FIFTEEN_RUNS) {
    for (const minimum of MINIMUMS) {
      for (const players of PLAYER_COUNTS) {
        for (const rounds of ROUND_COUNTS) {
          configs.push({ fifteenRun, minimum, players, rounds });
        }
      }
    }
  }
  return configs;
}

export function configLabel(c: SimConfig): string {
  return `15=${c.fifteenRun} min=${c.minimum} ${c.players}p`;
}
