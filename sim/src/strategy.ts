import type { Card } from './cards.js';
import {
  handTotals,
  isFiveCardCharlie,
  isHard16,
  isHard17Plus,
  isSoft17,
  isSoft18Plus,
} from './hand.js';
import type { HouseRules } from './rules.js';

export function meetsMinimumGate(cards: Card[], minimum: number): boolean {
  const { bust, best } = handTotals(cards);
  if (bust) return true;
  return best > minimum;
}

export function isChasingFiveCardOnHard16(cards: Card[]): boolean {
  return isHard16(cards) && cards.length < 5;
}

export function canStand(cards: Card[], rules: HouseRules): boolean {
  const t = handTotals(cards);
  if (t.bust) return false;
  if (!meetsMinimumGate(cards, rules.minimum)) return false;
  if (isChasingFiveCardOnHard16(cards)) return false;
  if (isFiveCardCharlie(cards)) return true;
  if (isHard17Plus(cards)) return true;
  if (isSoft18Plus(cards)) return true;
  if (isSoft17(cards)) return false;
  return false;
}

export function shouldHit(cards: Card[], rules: HouseRules): boolean {
  const t = handTotals(cards);
  if (t.bust) return false;
  if (cards.length >= 5) return false;
  if (isFiveCardCharlie(cards)) return false;
  if (!canStand(cards, rules)) return true;
  return false;
}

export function bankerShouldHit(
  cards: Card[],
  rules: HouseRules,
  hasUnresolvedTwoCardPlayers: boolean
): boolean {
  if (handTotals(cards).bust) return false;
  if (cards.length >= 5) return false;
  if (isFiveCardCharlie(cards)) return false;
  if (isSoft17(cards) && hasUnresolvedTwoCardPlayers) return true;
  return shouldHit(cards, rules);
}
