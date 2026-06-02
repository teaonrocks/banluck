import { useContext } from 'react'
import { RulesetContext } from '../context/ruleset-context'

export function useRuleset() {
  const ctx = useContext(RulesetContext)
  if (!ctx) throw new Error('useRuleset must be used within RulesetProvider')
  return ctx
}
