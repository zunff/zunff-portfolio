import { useRef, useState } from 'react'
import { Github, ExternalLink, Folder, ChevronDown, ChevronUp, Layers } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { TechBadge } from '@/components/shared/TechBadge'
import { cn } from '@/lib/utils'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import type { Project } from '@/types/portfolio'

function ProjectDescription({ description, isExpanded }: { description: string, isExpanded: boolean }) {
  const paragraphs = description.split('\n\n').filter(p => p.trim())

  if (paragraphs.length === 0) return null

  const previewParagraphs = paragraphs.slice(0, 1)
  const detailParagraphs = paragraphs.slice(1)

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
        {previewParagraphs.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {detailParagraphs.length > 0 && (
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                收起详情
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                查看详情
              </>
            )}
          </div>

          <div
            className={cn(
              'overflow-hidden transition-all duration-500 ease-in-out',
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            <div className="pt-2 text-sm text-muted-foreground leading-relaxed space-y-3 border-t border-border/50">
              {detailParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface ImageStackProps {
  images: string[]
  alt: string
  progress: MotionValue<number>
}

function ImageStack({ images, alt, progress }: ImageStackProps) {
  const N = images.length
  
  // The stacking phase is exactly 0.25 to 0.65
  // This leaves 0.65 -> 0.80 completely empty for a true "pause" before the card starts exiting
  const STACK_START = 0.25
  const STACK_END = 0.65
  const STACK_DURATION = STACK_END - STACK_START
  
  // Create an array of transforms for each image
  const imageTransforms = images.map((_, i) => {
    if (i === 0) {
      return { y: "0%", rotate: 0, scale: 1 }
    }
    
    // For images > 0, they slide up during their specific scroll window
    // We divide the STACK_DURATION window by (N-1) images
    const start = STACK_START + ((i - 1) / (N - 1)) * STACK_DURATION
    const end = STACK_START + (i / (N - 1)) * STACK_DURATION
    
    // Hardware accelerated transforms
    const y = useTransform(progress, [start, end], ["120%", "0%"])
    const rotate = useTransform(progress, [start, end], [i % 2 === 0 ? -2 : 2, 0]) // Reduced rotation for cleaner look
    const scale = useTransform(progress, [start, end], [0.95, 1]) // Less scaling down for larger images
    
    return { y, rotate, scale }
  })

  // Calculate active index based on progress
  const activeIndex = useTransform(progress, (p: number) => {
    if (p < STACK_START) return 0
    if (p > STACK_END) return N - 1
    const normalized = (p - STACK_START) / STACK_DURATION
    return Math.min(N - 1, Math.round(normalized * (N - 1)))
  })

  // Progress bar width
  const barWidth = useTransform(progress, [STACK_START, STACK_END], ["0%", "100%"])

  return (
    <div className="relative aspect-[4/3] md:aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
      {images.map((src, i) => {
        const transforms = imageTransforms[i]
        
        return (
          <motion.img
            key={src}
            src={src}
            alt={`${alt} - ${i + 1}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{
              y: transforms.y,
              rotate: transforms.rotate,
              scale: transforms.scale,
              zIndex: i + 1,
              // Only add shadow if it's not the first image, to give depth
              boxShadow: i > 0 ? '0 -20px 40px -10px rgba(0,0,0,0.8)' : 'none'
            }}
          />
        )
      })}

      {/* Top-right counter */}
      {N > 1 && (
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-medium border border-white/10 z-50 pointer-events-none shadow-lg flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-primary" />
          <motion.span>{useTransform(activeIndex, v => v + 1)}</motion.span>
          <span>/ {N}</span>
        </div>
      )}

      {/* Bottom progress bar */}
      {N > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-50 pointer-events-none">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60 shadow-[0_0_10px_rgba(34,197,94,0.6)]"
            style={{ width: barWidth }}
          />
        </div>
      )}
    </div>
  )
}

interface ScrollProjectProps {
  project: Project
  index: number
}

function ScrollProject({ project, index }: ScrollProjectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track raw scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth the scroll progress to eliminate "frame-by-frame" jitter
  // Stiffness controls speed, damping controls bounciness (lower = more bounce, higher = smoother stop)
  const smoothProgress = useSpring(scrollYProgress, { 
    stiffness: 100, 
    damping: 30, 
    restDelta: 0.001 
  })

  const fromLeft = index % 2 === 0
  const N = project.images.length

  // Animation Timeline (Smooth Progress 0 -> 1):
  // 0.00 - 0.15: Card slides in (x), scales up slightly
  // 0.15 - 0.20: Details panel fades in
  // 0.20 - 0.25: ProjectDescription auto-expands (simulating click)
  // 0.25 - 0.65: Images stack (handled inside ImageStack)
  // 0.65 - 0.80: TRUE PAUSE (Dwell time). Nothing happens here, just reading time.
  // 0.80 - 0.85: ProjectDescription auto-collapses (simulating click)
  // 0.85 - 0.90: Details panel fades out
  // 0.90 - 1.00: Card slides UP (y) and fades out slightly

  // 1. Card X Position (Slide in)
  // On mobile, slide from bottom instead of sides to prevent horizontal overflow issues
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const cardX = useTransform(
    smoothProgress,
    [0, 0.15],
    [isMobile ? "0%" : (fromLeft ? "-100%" : "100%"), "0%"]
  )
  
  const cardYEnter = useTransform(
    smoothProgress,
    [0, 0.15],
    [isMobile ? "50%" : "0%", "0%"]
  )

  // 2. Card Y Position (Scroll up at the end)
  const cardYExit = useTransform(
    smoothProgress,
    [0.90, 1],
    ["0%", "-100%"]
  )

  // Combine Y transforms
  const cardY = useTransform(
    [cardYEnter, cardYExit],
    ([enter, exit]) => {
      // If we're entering, use enter value. If exiting, use exit value.
      // Since they don't overlap in the timeline, we can just add them (one will be 0%)
      if (enter !== "0%") return enter
      return exit
    }
  )

  // 3. Card Scale (Slight pop-in effect)
  const cardScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.90, 1],
    [0.8, 1, 1, 0.9]
  )
  
  // 4. Card Opacity (Fade out at the end)
  const cardOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.90, 1],
    [0, 1, 1, 0]
  )

  // 5. Details Opacity (Fade in AFTER card arrives, fade out BEFORE card leaves)
  const detailsOpacity = useTransform(
    smoothProgress,
    [0.15, 0.20, 0.85, 0.90],
    [0, 1, 1, 0]
  )

  // 6. Details X Offset (Slide in with fade)
  const detailsX = useTransform(
    smoothProgress,
    [0.15, 0.20, 0.85, 0.90],
    [isMobile ? 0 : (fromLeft ? -30 : 30), 0, 0, isMobile ? 0 : (fromLeft ? -30 : 30)]
  )
  
  const detailsY = useTransform(
    smoothProgress,
    [0.15, 0.20, 0.85, 0.90],
    [isMobile ? 30 : 0, 0, 0, isMobile ? -30 : 0]
  )

  // 7. Auto-expand details logic
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Use Framer Motion's onChange to trigger React state for the CSS transition
  smoothProgress.on("change", (latest) => {
    // Expand between 0.20 and 0.80
    const shouldBeExpanded = latest > 0.20 && latest < 0.80
    if (isExpanded !== shouldBeExpanded) {
      setIsExpanded(shouldBeExpanded)
    }
  })

  // Calculate section height based on number of images to ensure enough scroll time
  // Base height 150vh + 30vh per image
  // Increased base height to give more "dwell time" before the card exits
  const sectionHeight = `${150 + (N * 30)}vh`

  return (
    <div ref={containerRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 md:px-8 overflow-hidden">
        <motion.article
          className="relative w-full max-w-6xl rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl overflow-hidden will-change-transform"
          style={{
            x: cardX,
            y: cardY,
            scale: cardScale,
            opacity: cardOpacity,
          }}
        >
          {/* Decorative gradient based on entry side */}
          <div
            className={cn(
              'absolute inset-0 pointer-events-none opacity-70',
              fromLeft
                ? 'bg-gradient-to-br from-primary/10 via-transparent to-transparent'
                : 'bg-gradient-to-bl from-primary/10 via-transparent to-transparent'
            )}
          />

          {/* Simple, robust CSS Grid layout. No dynamic heights or display toggles. */}
          <div className="relative grid md:grid-cols-2 gap-6 md:gap-8 items-center p-5 md:p-8 lg:p-12 min-h-[60vh] max-h-[90vh] overflow-y-auto hide-scrollbar">
            
            {/* Image stack side - always takes up its grid cell */}
            <div className={cn(
              'w-full flex items-center justify-center',
              index % 2 === 1 && 'md:order-2'
            )}>
              <ImageStack images={project.images} alt={project.title} progress={smoothProgress} />
            </div>

            {/* Details side - fades in/out via opacity, always occupies space */}
            <motion.div
              className={cn(
                'flex flex-col space-y-4 md:space-y-5 justify-center w-full',
                index % 2 === 1 && 'md:order-1'
              )}
              style={{
                opacity: detailsOpacity,
                x: detailsX,
                y: detailsY,
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-primary tracking-widest uppercase">
                  Project / {String(index + 1).padStart(2, '0')}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
              </div>

              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  {project.title}
                </h3>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:bg-primary/20 hover:border-primary/50 hover:text-primary cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg bg-primary/20 border border-primary/30 text-primary backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label={`View ${project.title} demo`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">{project.summary}</p>

              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>

              <ProjectDescription description={project.description} isExpanded={isExpanded} />
            </motion.div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </motion.article>
      </div>
    </div>
  )
}

export default function Projects() {
  const { projects } = portfolioConfig

  return (
    <section className="relative">
      {/* Section header */}
      <div className="relative px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Folder className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Projects
            </h2>
          </div>
          <p className="mt-3 text-muted-foreground text-sm md:text-base">
            向下滑动，探索每个项目
          </p>
        </div>
      </div>

      {/* Scroll-driven project sections */}
      {projects.map((project, index) => (
        <ScrollProject key={project.id} project={project} index={index} />
      ))}

      <div className="h-24 md:h-32" />
    </section>
  )
}
