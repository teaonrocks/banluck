import { ROUND_STEPS } from '@/data/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SectionHowToPlay() {
  return (
    <section id="how-to-play" className="border-b border-border py-16 max-[900px]:py-10">
      <SectionHeader
        number="03"
        label="Gameplay"
        title="How does a round work?"
        intro="Banluck is like blackjack at a family gathering — one banker, several players, and house rules that make every table a little different."
      />

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {ROUND_STEPS.map((step) => (
          <Card key={step.step}>
            <CardHeader>
              <Badge variant="destructive" className="mb-1 w-fit normal-case tracking-normal">
                Step {step.step}
              </Badge>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription>{step.body}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
