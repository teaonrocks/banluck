import type { CardDef } from '@/data/content'
import { isRedSuit, SUIT_SYMBOL } from '@/data/content'
import { cn } from '@/lib/utils'

interface PlayingCardProps {
  card: CardDef
  selected?: boolean
  interactive?: boolean
  onSelect?: () => void
}

export function PlayingCard({ card, selected, interactive, onSelect }: PlayingCardProps) {
  const red = isRedSuit(card.suit)
  const className = cn(
    'flex h-[104px] w-[76px] flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card shadow-sm transition-all max-[900px]:h-[80px] max-[900px]:w-[56px] max-[480px]:h-[72px] max-[480px]:w-[50px]',
    red ? 'text-destructive' : 'text-foreground',
    interactive && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
    selected && 'ring-2 ring-foreground ring-offset-2',
  )

  const content = (
    <>
      <span className="font-serif text-xl font-semibold leading-none max-[900px]:text-base max-[480px]:text-sm">
        {card.rank}
      </span>
      <span className="text-lg leading-none max-[900px]:text-base max-[480px]:text-sm" aria-hidden="true">
        {SUIT_SYMBOL[card.suit]}
      </span>
    </>
  )

  if (interactive) {
    return (
      <button type="button" className={className} onClick={onSelect} aria-pressed={selected}>
        {content}
      </button>
    )
  }

  return <div className={className}>{content}</div>
}

interface HandDisplayProps {
  cards: CardDef[]
  selected?: boolean
  onSelect?: () => void
  onHover?: () => void
  onLeave?: () => void
}

export function HandDisplay({
  cards,
  selected,
  onSelect,
  onHover,
  onLeave,
}: HandDisplayProps) {
  return (
    <div
      className={cn(
        'flex cursor-pointer gap-3 rounded-xl border border-transparent p-4 transition-colors max-[900px]:gap-2.5 max-[900px]:p-3 max-[480px]:-mx-2 max-[480px]:overflow-x-auto max-[480px]:px-2',
        selected && 'border-border bg-accent',
        !selected && 'hover:border-border hover:bg-accent',
      )}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.()
        }
      }}
      role="button"
      tabIndex={0}
    >
      {cards.map((card, i) => (
        <PlayingCard key={`${card.rank}-${card.suit}-${i}`} card={card} />
      ))}
    </div>
  )
}
