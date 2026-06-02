import { createContext } from 'react'
import type { useSimulationFilters } from '../hooks/useSimulationFilters'
import type { SimOutput } from '../types/simulation'

export interface RulesetContextValue {
  meta: SimOutput['meta']
  results: SimOutput['results']
  filters: ReturnType<typeof useSimulationFilters>
}

export const RulesetContext = createContext<RulesetContextValue | null>(null)
