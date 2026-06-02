import { Badge } from '@/components/ui/badge'

interface SectionHeaderProps {
  number: string
  label: string
  title: string
  intro?: string
}

export function SectionHeader({ number, label, title, intro }: SectionHeaderProps) {
  return (
    <>
      <Badge variant="label" className="mb-3">
        Section {number} · {label}
      </Badge>
      <h2 className="mb-5 font-serif text-[clamp(1.75rem,3vw,2.5rem)] tracking-tight">
        {title}
      </h2>
      {intro && (
        <p className="mb-8 max-w-2xl text-[1.05rem] leading-relaxed max-[900px]:mb-6 max-[900px]:text-base">
          {intro}
        </p>
      )}
    </>
  )
}
