import type { FifteenRun, Minimum, SimConfig, SimulationFilters } from '../types/simulation'

export interface NavSection {
  id: string
  number: string
  title: string
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'special-hands', number: '01', title: 'What are the special hands?' },
  { id: 'house-rules', number: '02', title: 'What house rules matter?' },
  { id: 'how-to-play', number: '03', title: 'How does a round work?' },
  { id: 'assumptions', number: '04', title: 'How do players and banker play?' },
  { id: 'simulation', number: '05', title: 'Who has the advantage?' },
]

export interface RulesetPreset {
  id: string
  label: string
  heroLabel: string
  heroChinese: string
  filters: Partial<SimulationFilters>
}

export const RULESET_PRESETS: RulesetPreset[] = [
  {
    id: 'standard',
    label: 'Standard',
    heroLabel: 'STANDARD RULES',
    heroChinese: '標準規則',
    filters: { fifteenRun: 'both', minimum: 14 },
  },
  {
    id: 'no-15',
    label: 'No 15 run',
    heroLabel: 'NO 15 RUN',
    heroChinese: '無十五點',
    filters: { fifteenRun: 'none' },
  },
  {
    id: 'banker-15',
    label: 'Banker 15 only',
    heroLabel: 'BANKER 15 ONLY',
    heroChinese: '莊家十五點',
    filters: { fifteenRun: 'banker_only' },
  },
  {
    id: 'all',
    label: 'All rules',
    heroLabel: 'ALL RULE COMBOS',
    heroChinese: '全部規則',
    filters: {},
  },
]

export type Suit = 'hearts' | 'diamonds' | 'spades' | 'clubs'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface CardDef {
  rank: Rank
  suit: Suit
}

export type SpecialHandCategory =
  | 'all'
  | 'blackjack'
  | 'pocketAces'
  | 'triple7'
  | 'fiveCard'
  | 'fiveCardBust'

export interface SpecialHand {
  id: SpecialHandCategory
  name: string
  chinese: string
  description: string
  payout: string
  detail: string
  beats: string
  cards: CardDef[]
}

export const SPECIAL_HANDS: SpecialHand[] = [
  {
    id: 'blackjack',
    name: 'Ban-Luck',
    chinese: '廿一點',
    description:
      'Your first two cards add up to exactly 21 — usually an Ace plus a ten-value card (10, Jack, Queen, or King).',
    payout: '2×',
    detail: 'Only counts on your opening two cards, before you take any more.',
    beats: 'Beats a normal win. Loses to Ban-Ban or triple 7.',
    cards: [
      { rank: 'A', suit: 'spades' },
      { rank: 'K', suit: 'hearts' },
    ],
  },
  {
    id: 'pocketAces',
    name: 'Ban-Ban',
    chinese: '對對和',
    description: 'Both of your first two cards are Aces — the strongest opening hand in Banluck.',
    payout: '3×',
    detail: 'Must be your first two cards only. Both cards must be Aces.',
    beats: 'Beats Ban-Luck and every other special hand except triple 7.',
    cards: [
      { rank: 'A', suit: 'hearts' },
      { rank: 'A', suit: 'diamonds' },
    ],
  },
  {
    id: 'triple7',
    name: 'Triple 7',
    chinese: '三條七',
    description: 'Exactly three cards, and all three are 7s. A rare jackpot hand.',
    payout: '7×',
    detail: 'You must have exactly three cards — no more, no less.',
    beats: 'Beats every other hand, including Ban-Ban.',
    cards: [
      { rank: '7', suit: 'spades' },
      { rank: '7', suit: 'hearts' },
      { rank: '7', suit: 'diamonds' },
    ],
  },
  {
    id: 'fiveCard',
    name: 'Gor-Leng',
    chinese: '五小龍',
    description: 'Five cards in your hand and you still have not gone over 21.',
    payout: '2×',
    detail: 'You kept hitting until you had five cards without busting.',
    beats: 'Beats a normal win. Loses to Ban-Luck, Ban-Ban, and triple 7.',
    cards: [
      { rank: '2', suit: 'clubs' },
      { rank: '3', suit: 'hearts' },
      { rank: '4', suit: 'spades' },
      { rank: '5', suit: 'diamonds' },
      { rank: '6', suit: 'clubs' },
    ],
  },
  {
    id: 'fiveCardBust',
    name: 'Five-card bust',
    chinese: '五爆',
    description: 'Your fifth card pushes you over 21 — a costly mistake.',
    payout: 'Lose 2×',
    detail: 'You chose to keep hitting and your fifth card busted you.',
    beats: 'This is always a loss — you pay double.',
    cards: [
      { rank: 'K', suit: 'spades' },
      { rank: 'Q', suit: 'hearts' },
      { rank: 'J', suit: 'diamonds' },
      { rank: '9', suit: 'clubs' },
      { rank: '5', suit: 'spades' },
    ],
  },
]

export interface FifteenRunOption {
  id: FifteenRun
  title: string
  description: string
  example: string
}

export const FIFTEEN_RUN_OPTIONS: FifteenRunOption[] = [
  {
    id: 'both',
    title: 'Both (standard)',
    description:
      'If a player opens with exactly 15, only that player pushes against the banker. If the banker opens with 15, every remaining player pushes.',
    example: 'You deal 8 + 7 on your first two cards — your hand is a free push. Everyone else keeps playing.',
  },
  {
    id: 'banker_only',
    title: 'Banker only',
    description:
      'Only the banker gets a 15 push. If the banker opens with 15, all players push. Players who open with 15 must keep playing normally.',
    example: 'The banker shows 15 — nobody wins or loses that round against the banker.',
  },
  {
    id: 'none',
    title: 'Disabled',
    description: 'Opening with 15 is treated like any other total. No free pushes.',
    example: '15 is just another number — you must keep hitting or standing by the usual rules.',
  },
]

export interface MinimumOption {
  value: Minimum
  title: string
  description: string
}

export const MINIMUM_OPTIONS: MinimumOption[] = [
  {
    value: 14,
    title: 'Minimum 14',
    description: 'You cannot stand until your total is above 14 — so 15 or higher.',
  },
  {
    value: 15,
    title: 'Minimum 15',
    description: 'You cannot stand until your total is above 15 — so 16 or higher.',
  },
  {
    value: 16,
    title: 'Minimum 16',
    description: 'You cannot stand until your total is above 16 — so 17 or higher.',
  },
]

export const ROUND_STEPS = [
  {
    step: 1,
    title: 'Pick a banker',
    body: 'One person deals and plays as the banker. Everyone else is a player trying to beat them.',
  },
  {
    step: 2,
    title: 'Get your cards',
    body: 'Each player receives two cards. Try to get as close to 21 as you can without going over.',
  },
  {
    step: 3,
    title: 'Hit or stand',
    body: 'Take more cards if you want a higher total, or stop when you are happy. Special hands pay extra; going over 21 means you bust and lose.',
  },
  {
    step: 4,
    title: 'Banker settles',
    body: 'The banker plays their hand last and can settle some players early — before finishing their own cards.',
  },
]

export function formatConfigLabel(config: SimConfig): string {
  const fifteen = fifteenRunLabel(config.fifteenRun)
  const min = `Min ${config.minimum}`
  return `${fifteen} · ${min} · ${config.players} players`
}

export function fifteenRunLabel(value: FifteenRun): string {
  switch (value) {
    case 'both':
      return '15 run: both'
    case 'banker_only':
      return '15 run: banker only'
    case 'none':
      return '15 run: off'
  }
}

export function minimumLabel(value: Minimum): string {
  return `Minimum ${value}`
}

export function explainBankerEdge(mean: number): string {
  const cents = Math.round(Math.abs(mean) * 100)
  if (mean > 0) {
    return `The banker wins about ${cents} cents per dollar bet, per hand, on average.`
  }
  if (mean < 0) {
    return `Players come out ahead by about ${cents} cents per dollar bet, per hand, on average.`
  }
  return 'Banker and players break even on average.'
}

export function fmtNum(n: number, digits = 4): string {
  return n.toFixed(digits)
}

export function fmtPct(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

export const SUIT_SYMBOL: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  spades: '♠',
  clubs: '♣',
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 'hearts' || suit === 'diamonds'
}
