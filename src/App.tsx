import { useEffect } from 'react'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import { ParticleBackground } from '@/components/shared/ParticleBackground'
import { ProjectPreviewStrip } from '@/components/shared/ProjectPreviewStrip'
import { portfolioConfig } from '@/config/portfolio.config'

function App() {
  const firstImages = portfolioConfig.projects.map(p => p.images[0]).filter(Boolean)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground />
      <main className="relative">
        <Hero />
        <ProjectPreviewStrip images={firstImages} />
        <Projects />
      </main>
    </div>
  )
}

export default App