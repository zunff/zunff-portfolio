import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import { ParticleBackground } from '@/components/shared/ParticleBackground'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <main className="relative">
        <Hero />
        <Projects />
      </main>
    </div>
  )
}

export default App
