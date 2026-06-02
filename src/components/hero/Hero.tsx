import { HeroArt } from './HeroArt'

export function Hero() {
  return (
    <>
      <header className="border-b border-border py-12 max-[900px]:py-6">
        <p className="mb-5 text-[0.7rem] tracking-[0.14em] uppercase text-destructive">
          BANLUCK GUIDE · 視覺指南
        </p>

        <div className="flex items-start gap-5 lg:gap-8">
          <div className="min-w-0 shrink-0">
            <h1 className="mb-1 font-serif text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">
              Learn banluck
            </h1>
            <p className="mb-6 font-serif text-[clamp(2rem,4vw,3rem)] leading-tight tracking-tight text-muted-foreground">
              A visual guide
            </p>
            <p
              className="font-serif text-[clamp(2.5rem,4vw,3.5rem)] tracking-wide text-destructive"
              lang="zh-Hant"
            >
              廿一點
            </p>
          </div>
          <HeroArt />
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 max-[900px]:mt-6 max-[900px]:gap-x-6">
          <div>
            <div className="mb-1 font-serif text-3xl leading-none max-[900px]:text-2xl">52</div>
            <div className="max-w-40 text-sm text-muted-foreground">cards in one deck</div>
          </div>
          <div>
            <div className="mb-1 font-serif text-3xl leading-none max-[900px]:text-2xl">5</div>
            <div className="max-w-40 text-sm text-muted-foreground">special winning hands</div>
          </div>
          <div>
            <div className="mb-1 font-serif text-3xl leading-none max-[900px]:text-2xl">2×–7×</div>
            <div className="max-w-40 text-sm text-muted-foreground">payout range on specials</div>
          </div>
        </div>
      </header>
      <p className="border-b border-border py-4 text-sm text-muted-foreground">
        Simulation data from Monte Carlo analysis
      </p>
    </>
  )
}
