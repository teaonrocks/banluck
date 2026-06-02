import { playRound, type PlayerSettlement, type RoundResult } from './round.js';
import type { HouseRules } from './rules.js';

export interface SessionStats {
  totalBankerDelta: number;
  totalPlayerRounds: number;
  playerWins: number;
  playerLosses: number;
  pushes: number;
  pushedRounds: number;
  specials: {
    blackjack: number;
    pocketAces: number;
    triple7: number;
    fiveCard: number;
    fiveCardBust: number;
  };
}

export function playSession(
  playerCount: number,
  rounds: number,
  rules: HouseRules,
  random: () => number
): SessionStats {
  const stats: SessionStats = {
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

  for (let r = 0; r < rounds; r++) {
    const result = playRound(playerCount, rules, random);
    accumulateRound(stats, result);
  }

  return stats;
}

function countSpecial(
  stats: SessionStats,
  s: PlayerSettlement['playerSpecial']
): void {
  if (s === 'blackjack') stats.specials.blackjack++;
  else if (s === 'pocket_aces') stats.specials.pocketAces++;
  else if (s === 'triple_seven') stats.specials.triple7++;
  else if (s === 'five_card') stats.specials.fiveCard++;
  else if (s === 'five_card_bust') stats.specials.fiveCardBust++;
}

function accumulateRound(stats: SessionStats, round: RoundResult): void {
  if (round.pushedRound) stats.pushedRounds++;

  for (const s of round.settlements) {
    stats.totalPlayerRounds++;
    stats.totalBankerDelta += s.bankerDelta;
    if (s.push) stats.pushes++;
    else if (s.bankerDelta > 0) stats.playerLosses++;
    else if (s.bankerDelta < 0) stats.playerWins++;

    countSpecial(stats, s.playerSpecial);
  }
}

export function sessionBankerUnitsPerRoundPerPlayer(
  stats: SessionStats
): number {
  if (stats.totalPlayerRounds === 0) return 0;
  return stats.totalBankerDelta / stats.totalPlayerRounds;
}

export function sessionPlayerWinRate(stats: SessionStats): number {
  if (stats.totalPlayerRounds === 0) return 0;
  return stats.playerWins / stats.totalPlayerRounds;
}

export function sessionBankerWinRate(stats: SessionStats): number {
  if (stats.totalPlayerRounds === 0) return 0;
  return stats.playerLosses / stats.totalPlayerRounds;
}
