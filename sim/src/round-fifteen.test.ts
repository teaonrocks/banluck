import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Card } from './cards.js';
import {
  applyFifteenRunAtDeal,
  type PlayerSettlement,
} from './round.js';

function c(rank: Card['rank']): Card {
  return { rank, suit: 'spades' };
}

describe('15 run at deal', () => {
  it('player 15 in both pushes only that player', () => {
    const bankerCards = [c('10'), c('K')];
    const players = [
      { index: 0, cards: [c('7'), c('8')], resolved: false },
      { index: 1, cards: [c('10'), c('9')], resolved: false },
    ];
    const settlements: PlayerSettlement[] = [];
    const any = applyFifteenRunAtDeal(
      { fifteenRun: 'both', minimum: 14 },
      bankerCards,
      players,
      settlements
    );
    assert.equal(any, true);
    assert.equal(players[0].resolved, true);
    assert.equal(players[1].resolved, false);
    assert.equal(settlements.length, 1);
    assert.equal(settlements[0].playerIndex, 0);
    assert.equal(settlements[0].push, true);
  });

  it('banker_only does not push players on player 15', () => {
    const bankerCards = [c('10'), c('K')];
    const players = [
      { index: 0, cards: [c('7'), c('8')], resolved: false },
    ];
    const settlements: PlayerSettlement[] = [];
    const any = applyFifteenRunAtDeal(
      { fifteenRun: 'banker_only', minimum: 14 },
      bankerCards,
      players,
      settlements
    );
    assert.equal(any, false);
    assert.equal(players[0].resolved, false);
  });
});
