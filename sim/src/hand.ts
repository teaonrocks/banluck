import type { Card, Rank } from './cards.js';
import { isTenValue, rankValue } from './cards.js';

export interface HandTotals {
  best: number;
  hard: number;
  soft: boolean;
  bust: boolean;
}

export function handTotals(cards: Card[]): HandTotals {
  let hard = 0;
  let aces = 0;
  for (const c of cards) {
    if (c.rank === 'A') {
      aces++;
      hard += 1;
    } else {
      hard += rankValue(c.rank);
    }
  }
  let best = hard;
  let soft = false;
  for (let i = 0; i < aces && best + 10 <= 21; i++) {
    best += 10;
    soft = true;
  }
  const bust = best > 21;
  return { best: bust ? hard : best, hard, soft: soft && !bust, bust };
}

export function isBlackjack(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  const { best, bust } = handTotals(cards);
  return !bust && best === 21;
}

export function isPocketAces(cards: Card[]): boolean {
  return cards.length === 2 && cards.every((c) => c.rank === 'A');
}

export function isTripleSeven(cards: Card[]): boolean {
  return (
    cards.length === 3 && cards.every((c) => c.rank === '7')
  );
}

export function isFiveCardCharlie(cards: Card[]): boolean {
  return cards.length === 5 && !handTotals(cards).bust;
}

export function isFiveCardBust(cards: Card[]): boolean {
  return cards.length === 5 && handTotals(cards).bust;
}

export function firstTwoTotal(cards: Card[]): number {
  return handTotals(cards.slice(0, 2)).best;
}

export function isHard16(cards: Card[]): boolean {
  const t = handTotals(cards);
  return !t.soft && !t.bust && t.best === 16;
}

export function isHard17Plus(cards: Card[]): boolean {
  const t = handTotals(cards);
  return !t.soft && !t.bust && t.best >= 17;
}

export function isSoft17(cards: Card[]): boolean {
  const t = handTotals(cards);
  return t.soft && !t.bust && t.best === 17;
}

export function isSoft18Plus(cards: Card[]): boolean {
  const t = handTotals(cards);
  return t.soft && !t.bust && t.best >= 18;
}

export type SpecialOutcome =
  | 'blackjack'
  | 'pocket_aces'
  | 'triple_seven'
  | 'five_card'
  | 'five_card_bust'
  | null;

export function detectSpecial(cards: Card[]): SpecialOutcome {
  if (cards.length === 2) {
    if (isPocketAces(cards)) return 'pocket_aces';
    if (isBlackjack(cards)) return 'blackjack';
  }
  if (isTripleSeven(cards)) return 'triple_seven';
  if (isFiveCardBust(cards)) return 'five_card_bust';
  if (isFiveCardCharlie(cards)) return 'five_card';
  return null;
}

export function specialMultiplier(special: SpecialOutcome): number {
  switch (special) {
    case 'blackjack':
      return 2;
    case 'pocket_aces':
      return 3;
    case 'triple_seven':
      return 7;
    case 'five_card':
      return 2;
    case 'five_card_bust':
      return 2;
    default:
      return 1;
  }
}

export function compareHands(
  playerCards: Card[],
  bankerCards: Card[]
): 'player' | 'banker' | 'push' {
  const p = handTotals(playerCards);
  const b = handTotals(bankerCards);
  if (p.bust && b.bust) return 'push';
  if (p.bust) return 'banker';
  if (b.bust) return 'player';
  if (p.best > b.best) return 'player';
  if (b.best > p.best) return 'banker';
  return 'push';
}
