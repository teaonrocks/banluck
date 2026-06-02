import type { Card } from './cards.js';
import { Deck } from './cards.js';
import {
  compareHands,
  detectSpecial,
  firstTwoTotal,
  handTotals,
  isFiveCardBust,
  isSoft17,
  specialMultiplier,
  type SpecialOutcome,
} from './hand.js';
import type { HouseRules } from './rules.js';
import { bankerShouldHit, canStand, shouldHit } from './strategy.js';

export interface RoundResult {
  settlements: PlayerSettlement[];
  pushedRound: boolean;
}

export interface PlayerSettlement {
  playerIndex: number;
  bankerDelta: number;
  push: boolean;
  playerSpecial: SpecialOutcome;
  bankerSpecial: SpecialOutcome;
}

interface PlayerState {
  index: number;
  cards: Card[];
  resolved: boolean;
}

function pushSettlement(player: PlayerState): PlayerSettlement {
  return {
    playerIndex: player.index,
    bankerDelta: 0,
    push: true,
    playerSpecial: null,
    bankerSpecial: null,
  };
}

/** Apply 15-run at deal. Player 15 = push only that hand; game continues for others. */
export function applyFifteenRunAtDeal(
  rules: HouseRules,
  bankerCards: Card[],
  players: PlayerState[],
  settlements: PlayerSettlement[]
): boolean {
  if (rules.fifteenRun === 'none') return false;

  let anyPush = false;
  const bankerFifteen = firstTwoTotal(bankerCards) === 15;

  if (rules.fifteenRun === 'both') {
    for (const player of players) {
      if (!player.resolved && firstTwoTotal(player.cards) === 15) {
        player.resolved = true;
        settlements.push(pushSettlement(player));
        anyPush = true;
      }
    }
  }

  if (
    bankerFifteen &&
    (rules.fifteenRun === 'banker_only' || rules.fifteenRun === 'both')
  ) {
    for (const player of players) {
      if (!player.resolved) {
        player.resolved = true;
        settlements.push(pushSettlement(player));
        anyPush = true;
      }
    }
  }

  return anyPush;
}

function settlePlayerVsBanker(
  playerCards: Card[],
  bankerCards: Card[]
): { bankerDelta: number; push: boolean } {
  const pSpec = detectSpecial(playerCards);
  const bSpec = detectSpecial(bankerCards);

  if (isFiveCardBust(playerCards) && !isFiveCardBust(bankerCards)) {
    return { bankerDelta: 2, push: false };
  }
  if (isFiveCardBust(bankerCards) && !isFiveCardBust(playerCards)) {
    return { bankerDelta: -2, push: false };
  }

  const pMul = pSpec ? specialMultiplier(pSpec) : 0;
  const bMul = bSpec ? specialMultiplier(bSpec) : 0;

  if (pMul > 0 || bMul > 0) {
    if (pMul > bMul) return { bankerDelta: -pMul, push: false };
    if (bMul > pMul) return { bankerDelta: bMul, push: false };
    return { bankerDelta: 0, push: true };
  }

  const cmp = compareHands(playerCards, bankerCards);
  if (cmp === 'player') return { bankerDelta: -1, push: false };
  if (cmp === 'banker') return { bankerDelta: 1, push: false };
  return { bankerDelta: 0, push: true };
}

function settlePlayer(
  player: PlayerState,
  bankerCards: Card[]
): PlayerSettlement {
  const { bankerDelta, push } = settlePlayerVsBanker(
    player.cards,
    bankerCards
  );
  return {
    playerIndex: player.index,
    bankerDelta,
    push,
    playerSpecial: detectSpecial(player.cards),
    bankerSpecial: detectSpecial(bankerCards),
  };
}

function hasTwoCardSpecial(cards: Card[]): boolean {
  if (cards.length !== 2) return false;
  const spec = detectSpecial(cards);
  return spec === 'blackjack' || spec === 'pocket_aces';
}

function bankerBeatsPlayerOpen(
  playerCards: Card[],
  bankerCards: Card[]
): boolean {
  const p = handTotals(playerCards);
  if (p.bust) return true;
  const b = handTotals(bankerCards);
  if (b.bust) return false;
  return b.best > p.best;
}

export function playRound(
  playerCount: number,
  rules: HouseRules,
  random: () => number
): RoundResult {
  const deck = new Deck(random);
  const bankerCards: Card[] = [deck.draw(), deck.draw()];
  const players: PlayerState[] = Array.from({ length: playerCount }, (_, i) => ({
    index: i,
    cards: [deck.draw(), deck.draw()],
    resolved: false,
  }));

  const settlements: PlayerSettlement[] = [];
  const hadFifteenPush = applyFifteenRunAtDeal(
    rules,
    bankerCards,
    players,
    settlements
  );

  for (const player of players) {
    const pTwo = hasTwoCardSpecial(player.cards);
    const bTwo = hasTwoCardSpecial(bankerCards);
    if (pTwo || bTwo) {
      player.resolved = true;
      settlements.push(settlePlayer(player, bankerCards));
    }
  }

  for (const player of players) {
    if (player.resolved) continue;
    while (shouldHit(player.cards, rules)) {
      player.cards.push(deck.draw());
      if (handTotals(player.cards).bust && player.cards.length < 5) {
        break;
      }
      if (player.cards.length >= 5) break;
      if (canStand(player.cards, rules)) break;
    }
  }

  const activePlayers = () => players.filter((p) => !p.resolved);

  if (isSoft17(bankerCards)) {
    for (const player of activePlayers()) {
      if (player.cards.length >= 3) {
        if (bankerBeatsPlayerOpen(player.cards, bankerCards)) {
          player.resolved = true;
          settlements.push(settlePlayer(player, bankerCards));
        }
      }
    }
  }

  while (
    bankerShouldHit(
      bankerCards,
      rules,
      activePlayers().some((p) => p.cards.length === 2)
    )
  ) {
    for (const player of activePlayers()) {
      if (bankerBeatsPlayerOpen(player.cards, bankerCards)) {
        player.resolved = true;
        settlements.push(settlePlayer(player, bankerCards));
      }
    }

    bankerCards.push(deck.draw());

    if (handTotals(bankerCards).bust && bankerCards.length < 5) break;
    if (bankerCards.length >= 5) break;
    if (canStand(bankerCards, rules)) break;
  }

  for (const player of activePlayers()) {
    player.resolved = true;
    settlements.push(settlePlayer(player, bankerCards));
  }

  const byIndex = new Map<number, PlayerSettlement>();
  for (const s of settlements) {
    byIndex.set(s.playerIndex, s);
  }

  return {
    pushedRound: hadFifteenPush,
    settlements: players.map(
      (p) =>
        byIndex.get(p.index) ?? {
          playerIndex: p.index,
          bankerDelta: 0,
          push: true,
          playerSpecial: null,
          bankerSpecial: null,
        }
    ),
  };
}
