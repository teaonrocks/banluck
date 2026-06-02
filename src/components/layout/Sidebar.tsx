import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { NAV_SECTIONS } from '@/data/content'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

function SiteBrand() {
  return (
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
  )
}

interface NavListProps {
  activeId: string
  onNavigate: (id: string) => void
  className?: string
}

function NavList({ activeId, onNavigate, className }: NavListProps) {
  return (
    <nav aria-label="Sections" className={className}>
      <ul className="flex flex-col gap-0.5">
        {NAV_SECTIONS.map((section) => {
          const active = activeId === section.id
          return (
            <li key={section.id}>
              <button
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => onNavigate(section.id)}
                className={cn(
                  'flex w-full items-baseline gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
                  active
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="min-w-[1.1rem] text-xs tabular-nums opacity-50">
                  {section.number}
                </span>
                <span className="text-[0.8125rem] leading-snug">{section.title}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function Sidebar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const sectionIds = NAV_SECTIONS.map((s) => s.id)
  const { activeId, scrollTo } = useScrollSpy(sectionIds)

  const handleNavigate = (id: string) => {
    scrollTo(id)
    setMenuOpen(false)
  }

  return (
    <>
      <aside className="fixed top-0 left-0 z-10 hidden h-svh w-[var(--sidebar-width)] flex-col justify-center overflow-y-auto border-r border-border bg-background px-6 min-[901px]:flex">
        <div className="flex flex-col gap-10">
          <SiteBrand />
          <NavList activeId={activeId} onNavigate={scrollTo} />
        </div>
      </aside>

      <header
        data-site-header
        className="sticky top-0 z-20 flex w-full shrink-0 items-center justify-between border-b border-border bg-background px-4 py-3 min-[901px]:hidden"
      >
        <SiteBrand />

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation menu">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="px-4 pb-6">
            <SheetHeader className="px-0 pt-2 pb-4">
              <SheetTitle className="font-serif text-lg font-medium">Sections</SheetTitle>
            </SheetHeader>
            <NavList activeId={activeId} onNavigate={handleNavigate} />
          </SheetContent>
        </Sheet>
      </header>
    </>
  )
}
