import { useState } from 'react'
import { SPECIAL_HANDS } from '@/data/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { HandDisplay } from '@/components/ui/PlayingCard'

export function SectionSpecialHands() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const focusedId = hoveredId ?? selectedId
  const activeHand = SPECIAL_HANDS.find((h) => h.id === focusedId) ?? null

  return (
    <section id="special-hands" className="border-b border-border py-16">
      <SectionHeader
        number="01"
        label="Special hands"
        title="What are the special hands?"
        intro="Banluck uses a standard 52-card deck. Most hands are won by getting closer to 21 than the banker without busting — but five special hands pay extra (or cost extra if you bust on five cards)."
      />

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[240px_1fr]">
        <div className="space-y-3">
          {activeHand ? (
            <>
              <h3 className="font-serif text-xl leading-snug">{activeHand.name}</h3>
              <p className="font-serif text-lg text-destructive" lang="zh-Hant">
                {activeHand.chinese}
              </p>
              <p className="font-serif text-2xl leading-none text-destructive">{activeHand.payout}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {activeHand.description}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">{activeHand.detail}</p>
              <p className="border-t border-border pt-3 text-sm leading-relaxed">
                {activeHand.beats}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-serif text-xl leading-snug">Hover or tap a hand</h3>
              <p className="font-serif text-lg text-destructive" lang="zh-Hant">
                特殊牌型
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Select a special hand to see its payout, when it applies, and how it compares to
                other hands.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {SPECIAL_HANDS.map((hand) => (
            <HandDisplay
              key={hand.id}
              cards={hand.cards}
              selected={focusedId === hand.id}
              onSelect={() => setSelectedId(hand.id)}
              onHover={() => setHoveredId(hand.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
