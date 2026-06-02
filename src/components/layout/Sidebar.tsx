import { NAV_SECTIONS } from '@/data/content'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const sectionIds = NAV_SECTIONS.map((s) => s.id)
  const { activeId, scrollTo } = useScrollSpy(sectionIds)

  return (
    <aside className="fixed top-0 left-0 z-10 flex h-svh w-[var(--sidebar-width)] flex-col justify-center overflow-y-auto border-r border-border bg-background px-6 max-[900px]:static max-[900px]:h-auto max-[900px]:w-full max-[900px]:justify-start max-[900px]:px-4 max-[900px]:py-4">
      <div className="flex flex-col gap-10 max-[900px]:gap-4">
        <div className="flex items-center gap-2 font-sans text-[0.95rem] font-medium tracking-tight">
          <span
            className="grid size-6 place-items-center rounded-sm border border-border bg-card text-xs"
            aria-hidden="true"
          >
            ♠
          </span>
          <span>
            Banluck{' '}
            <span className="text-destructive" lang="zh-Hant">
              廿一點
            </span>
          </span>
        </div>

        <nav aria-label="Sections">
          <ul className="flex flex-col gap-0.5 max-[900px]:flex-row max-[900px]:flex-wrap max-[900px]:gap-1">
            {NAV_SECTIONS.map((section) => {
              const active = activeId === section.id
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    onClick={() => scrollTo(section.id)}
                    className={cn(
                      'flex w-full items-baseline gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors max-[900px]:w-auto',
                      active
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="min-w-[1.1rem] text-xs tabular-nums opacity-50 max-[900px]:hidden">
                      {section.number}
                    </span>
                    <span className="text-[0.8125rem] leading-snug">{section.title}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
