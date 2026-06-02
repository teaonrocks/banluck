import { useEffect, useState } from 'react'

function getSectionTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY
}

function getScrollOffset(defaultOffset: number): number {
  if (!window.matchMedia('(max-width: 900px)').matches) return defaultOffset
  const header = document.querySelector('[data-site-header]')
  return header ? header.getBoundingClientRect().height + 16 : defaultOffset
}

export function useScrollSpy(sectionIds: string[], offset = 120) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const update = () => {
      const scrollOffset = getScrollOffset(offset)
      const scrollPosition = window.scrollY + scrollOffset
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 48

      if (atBottom) {
        setActiveId(sectionIds[sectionIds.length - 1]!)
        return
      }

      let current = sectionIds[0]!
      for (const el of elements) {
        if (getSectionTop(el) <= scrollPosition) {
          current = el.id
        }
      }
      setActiveId(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sectionIds, offset])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const top = getSectionTop(el) - getScrollOffset(offset) + 1
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return { activeId, scrollTo }
}
