/** Player/banker behavior encoded in sim/src/strategy.ts and sim/src/round.ts */

export interface BehaviorNote {
  title: string
  detail: string
}

export const PLAYER_BEHAVIOR: BehaviorNote[] = [
  {
    title: 'Minimum gate',
    detail:
      'Cannot stand until your total is above the house minimum (e.g. minimum 14 means you need 15+).',
  },
  {
    title: 'When to stand',
    detail: 'Stand on hard 17+, soft 18+, or five cards without bust — once past the minimum.',
  },
  {
    title: 'Hard 16',
    detail: 'Keep hitting until you have five cards or bust.',
  },
]

export const BANKER_BEHAVIOR: BehaviorNote[] = [
  {
    title: 'Hit and stand',
    detail: 'Same minimum gate and stand rules as players.',
  },
  {
    title: 'Soft 17',
    detail:
      'Before hitting, settle any player with three or more cards if the banker already beats them. Must hit on soft 17 while any player still has only two cards.',
  },
  {
    title: 'Before each hit',
    detail:
      'Settle any player who is bust or below the banker’s total, then draw if the banker still must hit.',
  },
]

/** HTML fragment for sim/results.html */
export function renderAssumptionsHtml(escape: (s: string) => string): string {
  const section = (heading: string, items: BehaviorNote[]) =>
    `<h3>${escape(heading)}</h3><ul>${items
      .map((i) => `<li><strong>${escape(i.title)}</strong> — ${escape(i.detail)}</li>`)
      .join('')}</ul>`
  return section('Players', PLAYER_BEHAVIOR) + section('Banker', BANKER_BEHAVIOR)
}
