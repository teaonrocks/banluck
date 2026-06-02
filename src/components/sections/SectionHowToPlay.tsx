import { ROUND_STEPS } from '@/data/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

export function SectionHowToPlay() {
  return (
    <section id="how-to-play" className="border-b border-border py-16 max-[900px]:py-10">
      <SectionHeader
        number="03"
        label="Gameplay"
        title="How does a round work?"
        intro="Banluck is like blackjack at a family gathering — one banker, several players, and house rules that make every table a little different."
      />

      <ol className="relative mt-8">
        {ROUND_STEPS.map((step, index) => (
          <li
            key={step.step}
            className="group relative flex gap-5 pb-10 last:pb-0 sm:gap-6"
          >
            {index < ROUND_STEPS.length - 1 && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-4 top-[calc(1.25rem+1rem)] bottom-[calc(-1.25rem-1rem)] z-0 w-px -translate-x-1/2 bg-border transition-colors duration-300 group-hover:bg-destructive/35 sm:left-5"
              />
            )}

            <div className="relative z-10 flex w-8 shrink-0 justify-center pt-5 sm:w-10">
              <span
                aria-hidden
                className={cn(
                  'flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card font-sans text-sm font-medium text-destructive shadow-sm transition-all duration-300',
                  'group-hover:scale-110 group-hover:border-destructive group-hover:bg-destructive group-hover:text-white group-hover:shadow-md',
                )}
              >
                {step.step}
              </span>
            </div>

            <article
              className={cn(
                'relative z-10 min-w-0 flex-1 rounded-xl border border-border bg-card px-5 py-5 shadow-sm transition-all duration-300',
                'group-hover:-translate-y-0.5 group-hover:border-destructive/25 group-hover:shadow-md',
              )}
            >
              <h3 className="font-serif text-lg font-medium leading-snug tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
