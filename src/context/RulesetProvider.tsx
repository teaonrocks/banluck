import { type ReactNode } from 'react'
import simData from '../data/results.json'
import { RULESET_PRESETS } from '../data/content'
import { useSimulationFilters } from '../hooks/useSimulationFilters'
import type { SimOutput } from '../types/simulation'
import { RulesetContext } from './ruleset-context'

const output = simData as SimOutput
const defaultPreset = RULESET_PRESETS.find((p) => p.id === 'all')!

export function RulesetProvider({ children }: { children: ReactNode }) {
  const filters = useSimulationFilters(output.results, defaultPreset)

  return (
    <RulesetContext.Provider
      value={{
        meta: output.meta,
        results: output.results,
        filters,
      }}
    >
      {children}
    </RulesetContext.Provider>
  )
}
