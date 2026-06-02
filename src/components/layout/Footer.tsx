import { ExternalLinkIcon } from 'lucide-react'

const GITHUB_ISSUES_URL = 'https://github.com/teaonrocks/banluck/issues'

export function Footer() {
  return (
    <footer className="border-t border-border py-8 max-[900px]:py-6">
      <p className="text-sm text-muted-foreground">
        Missing a house rule?{' '}
        <a
          href={GITHUB_ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-foreground underline decoration-border underline-offset-[3px] transition-colors hover:text-accent-red hover:decoration-accent-red"
        >
          Suggest one on GitHub
          <ExternalLinkIcon className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
          <span className="sr-only"> (opens in new tab)</span>
        </a>{' '}
        and we can add it to the simulation.
      </p>
    </footer>
  )
}
