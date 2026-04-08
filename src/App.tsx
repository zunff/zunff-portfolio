import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#111827]">
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <Hero />
        <Projects />
      </main>
    </div>
  )
}

export default App
