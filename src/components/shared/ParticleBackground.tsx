import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

function getPrimaryColor(): { r: number; g: number; b: number } {
  if (typeof window === 'undefined') return { r: 34, g: 197, b: 94 }
  const style = getComputedStyle(document.documentElement)
  const primary = style.getPropertyValue('--primary').trim()
  if (!primary) return { r: 34, g: 197, b: 94 }
  // Parse HSL value (e.g., "160 84% 45%")
  const [h, s, l] = primary.split(/\s+/).map(v => parseFloat(v))
  return hslToRgb(h, s, l)
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100
  l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  }
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const reducedMotionRef = useRef(false)
  const colorRef = useRef({ r: 34, g: 197, b: 94 })

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(30, Math.floor((width * height) / 30000))
    const particles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 2 + 1.5,
        opacity: Math.random() * 0.4 + 0.1,
      })
    }

    particlesRef.current = particles
  }, [])

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)

    const particles = particlesRef.current
    const mouse = mouseRef.current
    const connectionDistance = 120
    const mouseInfluenceRadius = 100
    const { r, g, b } = colorRef.current

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.15
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw and update particles
    particles.forEach((particle) => {
      // Mouse interaction
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < mouseInfluenceRadius && distance > 0) {
        const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius
        particle.vx += (dx / distance) * force * 0.01
        particle.vy += (dy / distance) * force * 0.01
      }

      // Update position
      if (!reducedMotionRef.current) {
        particle.x += particle.vx
        particle.y += particle.vy

        // Add slight friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Re-add some random movement
        particle.vx += (Math.random() - 0.5) * 0.01
        particle.vy += (Math.random() - 0.5) * 0.01
      }

      // Wrap around edges
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      // Draw particle
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`
      ctx.fill()
    })
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawParticles(ctx, canvas.width, canvas.height)

    animationRef.current = requestAnimationFrame(animate)
  }, [drawParticles])

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = mediaQuery.matches

    // Read primary color from CSS variable
    colorRef.current = getPrimaryColor()

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }

    mediaQuery.addEventListener('change', handleChange)

    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Intersection Observer - only animate when visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate()
        } else {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
          }
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(canvas)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      mediaQuery.removeEventListener('change', handleChange)
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: 'transform' }}
      aria-hidden="true"
    />
  )
}
