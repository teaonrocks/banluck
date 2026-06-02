import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Card } from './cards.js';
import {
  handTotals,
  isBlackjack,
  isPocketAces,
  isTripleSeven,
  isFiveCardCharlie,
} from './hand.js';
import { canStand, meetsMinimumGate } from './strategy.js';
import type { HouseRules } from './rules.js';

function c(rank: Card['rank']): Card {
  return { rank, suit: 'spades' };
}

describe('hand totals', () => {
  it('counts blackjack', () => {
    assert.equal(isBlackjack([c('A'), c('K')]), true);
  });

  it('counts pocket aces', () => {
    assert.equal(isPocketAces([c('A'), c('A')]), true);
  });

  it('triple seven only on exactly 3 sevens', () => {
    assert.equal(isTripleSeven([c('7'), c('7'), c('7')]), true);
    assert.equal(isTripleSeven([c('7'), c('7'), c('7'), c('2')]), false);
    assert.equal(isTripleSeven([c('7'), c('7'), c('K')]), false);
  });
});

describe('minimum stand gate', () => {
  const rules: HouseRules = { fifteenRun: 'none', minimum: 14 };

  it('cannot stand on 14 when minimum is 14', () => {
    const cards = [c('7'), c('7')];
    assert.equal(meetsMinimumGate(cards, 14), false);
    assert.equal(canStand(cards, rules), false);
  });

  it('can stand on hard 17 above minimum', () => {
    const cards = [c('10'), c('7')];
    assert.equal(canStand(cards, rules), true);
  });
});

describe('five card charlie', () => {
  it('detects 5 non-bust cards', () => {
    const cards = [c('2'), c('3'), c('4'), c('5'), c('2')];
    assert.equal(isFiveCardCharlie(cards), true);
    assert.equal(handTotals(cards).bust, false);
  });
});
