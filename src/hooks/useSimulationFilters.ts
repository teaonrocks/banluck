import { useCallback, useMemo, useState } from 'react'
import type { ConfigResult, SimulationFilters } from '../types/simulation'
import type { RulesetPreset } from '../data/content'

const EMPTY_FILTERS: SimulationFilters = {
  advantage: '',
  fifteenRun: '',
  minimum: '',
  players: '',
}

export function filtersFromPreset(preset: RulesetPreset): SimulationFilters {
  return {
    ...EMPTY_FILTERS,
    ...preset.filters,
  }
}

export function useSimulationFilters(
  results: ConfigResult[],
  initialPreset: RulesetPreset,
) {
  const [filters, setFilters] = useState<SimulationFilters>(() =>
    filtersFromPreset(initialPreset),
  )

  const applyPreset = useCallback((preset: RulesetPreset) => {
    setFilters(filtersFromPreset(preset))
  }, [])

  const filtered = useMemo(() => {
    return results.filter((r) => {
      const c = r.config
      const edge = r.bankerUnitsPerRoundPerPlayer.mean
      if (filters.advantage === 'banker' && edge <= 0) return false
      if (filters.advantage === 'player' && edge >= 0) return false
      if (filters.fifteenRun && c.fifteenRun !== filters.fifteenRun) return false
      if (filters.minimum && c.minimum !== filters.minimum) return false
      if (filters.players && c.players !== filters.players) return false
      return true
    })
  }, [results, filters])

  const byBanker = useMemo(
    () =>
      [...filtered].sort(
        (a, b) =>
          b.bankerUnitsPerRoundPerPlayer.mean - a.bankerUnitsPerRoundPerPlayer.mean,
      ),
    [filtered],
  )

  const byPlayer = useMemo(
    () =>
      [...filtered].sort(
        (a, b) =>
          a.bankerUnitsPerRoundPerPlayer.mean - b.bankerUnitsPerRoundPerPlayer.mean,
      ),
    [filtered],
  )

  const updateFilter = useCallback(
    <K extends keyof SimulationFilters>(key: K, value: SimulationFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  return {
    filters,
    filtered,
    byBanker,
    byPlayer,
    applyPreset,
    updateFilter,
    setFilters,
  }
}
