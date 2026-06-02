export type FifteenRun = 'both' | 'banker_only' | 'none'
export type Minimum = 14 | 15 | 16

export interface SimConfig {
  fifteenRun: FifteenRun
  minimum: Minimum
  players: 3 | 5 | 7 | 10
  rounds: 10 | 30 | 50 | 70 | 100
}

export interface StatSummary {
  mean: number
  std: number
  ci95: [number, number]
}

export interface ConfigResult {
  config: SimConfig
  label: string
  bankerUnitsPerRoundPerPlayer: StatSummary
  playerWinRate: StatSummary
  pushRate: number
  pushedRoundRate: number
  specialRates: {
    blackjack: number
    pocketAces: number
    triple7: number
    fiveCard: number
    fiveCardBust: number
  }
}

export interface SimOutput {
  meta: {
    trials: number
    seed: number
    generatedAt: string
    rulesVersion: string
  }
  results: ConfigResult[]
}

export interface SimulationFilters {
  fifteenRun: FifteenRun | ''
  minimum: Minimum | ''
  players: SimConfig['players'] | ''
  rounds: SimConfig['rounds'] | ''
}
