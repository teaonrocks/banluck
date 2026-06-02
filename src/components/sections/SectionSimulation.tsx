import { useState } from 'react'
import { useRuleset } from '@/hooks/useRuleset'
import {
  explainBankerEdge,
  formatConfigLabel,
  fmtNum,
  fmtPct,
} from '@/data/content'
import { SectionHeader } from '@/components/ui/SectionHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Advantage, FifteenRun, Minimum, SimConfig } from '@/types/simulation'
import { cn } from '@/lib/utils'

export function SectionSimulation() {
  const { meta, results, filters } = useRuleset()
  const { filtered, sortedFiltered, byBanker, byPlayer, updateFilter } = filters
  const [explorerOpen, setExplorerOpen] = useState(true)

  const bestBanker = byBanker.slice(0, 5)
  const bestPlayer = byPlayer.slice(0, 5)

  return (
    <section id="simulation" className="border-b border-border py-16 max-[900px]:py-10">
      <SectionHeader
        number="04"
        label="Simulation"
        title="Who has the advantage?"
        intro="We ran thousands of imaginary game nights — 100 rounds per session — for each rule combination. Here is what the numbers say about banker vs player advantage."
      />

      <Card className="mb-8">
        <CardContent className="pt-5 text-sm">
          <strong className="font-serif">Banker edge</strong> — on average, how many bet units the
          banker wins per hand, per player. A positive number means the banker comes out ahead over
          time.{' '}
          <strong className="font-serif">Player win rate</strong> — the share of hands where a
          player beats the banker.{' '}
          <strong className="font-serif">Banker win rate</strong> — the share of hands where the
          banker beats the player.{' '}
          <strong className="font-serif">Push rate</strong> — the share of tied hands; neither side
          wins or loses the bet on that hand. Player, banker, and push rates add up to 100% of all
          hands. Sorting by advantage uses banker edge (units won per hand), not win rate alone.
        </CardContent>
      </Card>

      <div className="mb-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Best for the banker</CardTitle>
            <CardDescription>Highest banker edge in the current filter</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {bestBanker.map((r) => (
                <li key={r.label}>
                  <strong className="text-destructive">{formatConfigLabel(r.config)}</strong>
                  <br />
                  {fmtNum(r.bankerUnitsPerRoundPerPlayer.mean)} units/hand ·{' '}
                  {explainBankerEdge(r.bankerUnitsPerRoundPerPlayer.mean)}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Best for players</CardTitle>
            <CardDescription>Lowest banker edge in the current filter</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {bestPlayer.map((r) => (
                <li key={r.label}>
                  <strong>{formatConfigLabel(r.config)}</strong>
                  <br />
                  {fmtNum(r.bankerUnitsPerRoundPerPlayer.mean)} units/hand ·{' '}
                  {explainBankerEdge(r.bankerUnitsPerRoundPerPlayer.mean)}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <Collapsible open={explorerOpen} onOpenChange={setExplorerOpen}>
        <CollapsibleTrigger>Explore all configurations</CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor="filter-advantage">Advantage</Label>
              <Select
                value={filters.filters.advantage || 'all'}
                onValueChange={(v) =>
                  updateFilter('advantage', v === 'all' ? '' : (v as Advantage))
                }
              >
                <SelectTrigger id="filter-advantage" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="banker">Banker favored</SelectItem>
                  <SelectItem value="player">Player favored</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-fifteen">15 run</Label>
              <Select
                value={filters.filters.fifteenRun || 'all'}
                onValueChange={(v) =>
                  updateFilter('fifteenRun', v === 'all' ? '' : (v as FifteenRun))
                }
              >
                <SelectTrigger id="filter-fifteen" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="banker_only">Banker only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-minimum">Minimum</Label>
              <Select
                value={filters.filters.minimum ? String(filters.filters.minimum) : 'all'}
                onValueChange={(v) =>
                  updateFilter('minimum', v === 'all' ? '' : (Number(v) as Minimum))
                }
              >
                <SelectTrigger id="filter-minimum" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="filter-players">Players</Label>
              <Select
                value={filters.filters.players ? String(filters.filters.players) : 'all'}
                onValueChange={(v) =>
                  updateFilter(
                    'players',
                    v === 'all' ? '' : (Number(v) as SimConfig['players']),
                  )
                }
              >
                <SelectTrigger id="filter-players" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="mb-3 text-sm text-muted-foreground">
            Showing {filtered.length} of {results.length} configurations ·{' '}
            {meta.trials.toLocaleString()} trials each · 100 rounds per session · seed {meta.seed}
          </p>

          <div className="max-h-[60vh] overflow-auto rounded-xl border border-border max-[900px]:-mx-1">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Configuration</TableHead>
                  <TableHead>Banker advantage</TableHead>
                  <TableHead>Player win rate</TableHead>
                  <TableHead>Banker win rate</TableHead>
                  <TableHead>Push rate</TableHead>
                  <TableHead>15-push rounds</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFiltered.map((r) => {
                  const bankerFavored = r.bankerUnitsPerRoundPerPlayer.mean > 0
                  return (
                    <TableRow key={r.label}>
                      <TableCell
                        className={cn(
                          'whitespace-normal',
                          bankerFavored && 'border-l-[3px] border-l-destructive',
                        )}
                      >
                        {formatConfigLabel(r.config)}
                      </TableCell>
                      <TableCell>{fmtNum(r.bankerUnitsPerRoundPerPlayer.mean)}</TableCell>
                      <TableCell>{fmtPct(r.playerWinRate.mean)}</TableCell>
                      <TableCell>{fmtPct(r.bankerWinRate.mean)}</TableCell>
                      <TableCell>{fmtPct(r.pushRate)}</TableCell>
                      <TableCell>{fmtPct(r.pushedRoundRate)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  )
}
