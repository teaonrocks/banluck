import { FIFTEEN_RUN_OPTIONS, MINIMUM_OPTIONS } from '@/data/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SectionHouseRules() {
  return (
    <section id="house-rules" className="border-b border-border py-16">
      <SectionHeader
        number="02"
        label="House rules"
        title="What house rules matter?"
        intro="Every Banluck table has local quirks. This simulation varies two house rules that change the odds significantly — the 15 run and the minimum stand gate."
      />

      <h3 className="mb-2 font-serif text-xl">The 15 run</h3>
      <p className="mb-4 max-w-2xl text-muted-foreground">
        Opening with exactly 15 on your first two cards is awkward — some tables treat it as a
        special push (no win, no loss).
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FIFTEEN_RUN_OPTIONS.map((opt) => (
          <Card key={opt.id}>
            <CardHeader>
              <CardTitle>{opt.title}</CardTitle>
              <CardDescription>{opt.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="rounded-lg bg-background p-3 text-sm leading-relaxed">{opt.example}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="mt-10 mb-2 font-serif text-xl">Minimum stand gate</h3>
      <p className="mb-4 max-w-2xl text-muted-foreground">
        Before you are allowed to stand, your total must be above a house minimum. Lower minimums
        give players more freedom; higher minimums force riskier hits.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MINIMUM_OPTIONS.map((opt) => (
          <Card key={opt.value}>
            <CardContent className="space-y-1.5">
              <CardTitle>{opt.title}</CardTitle>
              <CardDescription className="leading-relaxed">{opt.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 flex-row overflow-hidden">
        <div className="w-[3px] shrink-0 bg-destructive" aria-hidden="true" />
        <CardContent className="flex-1">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Real tables differ — these are the rules encoded in this simulation. Check with your
            host before betting.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
