import { BANKER_BEHAVIOR, PLAYER_BEHAVIOR } from '@/data/assumptions'
import { SectionHeader } from '@/components/ui/SectionHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function BehaviorList({ items }: { items: typeof PLAYER_BEHAVIOR }) {
  return (
    <ul className="space-y-3 text-sm">
      {items.map((item) => (
        <li key={item.title}>
          <strong className="text-foreground">{item.title}</strong>
          <span className="text-muted-foreground"> — {item.detail}</span>
        </li>
      ))}
    </ul>
  )
}

export function SectionAssumptions() {
  return (
    <section id="assumptions" className="border-b border-border py-16 max-[900px]:py-10">
      <SectionHeader
        number="04"
        label="Assumptions"
        title="How do players and the banker play?"
        intro="The simulation uses fixed hit/stand logic for everyone — not human judgment. Real tables may play differently."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Players</CardTitle>
            <CardDescription>Every player seat uses the same rules.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <BehaviorList items={PLAYER_BEHAVIOR} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Banker</CardTitle>
            <CardDescription>Same basics, plus early settlement.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <BehaviorList items={BANKER_BEHAVIOR} />
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
