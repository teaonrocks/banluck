import { RulesetProvider } from './context/RulesetProvider'
import { MainLayout } from './components/layout/MainLayout'
import { Hero } from './components/hero/Hero'
import { SectionSpecialHands } from './components/sections/SectionSpecialHands'
import { SectionHouseRules } from './components/sections/SectionHouseRules'
import { SectionHowToPlay } from './components/sections/SectionHowToPlay'
import { SectionSimulation } from './components/sections/SectionSimulation'
import { SectionAssumptions } from './components/sections/SectionAssumptions'

function App() {
  return (
    <RulesetProvider>
      <MainLayout>
        <Hero />
        <SectionSpecialHands />
        <SectionHouseRules />
        <SectionHowToPlay />
        <SectionAssumptions />
        <SectionSimulation />
      </MainLayout>
    </RulesetProvider>
  )
}

export default App
