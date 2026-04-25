import { useRef, useState, useEffect } from 'react'
import { Github, ExternalLink, Folder, ChevronDown, ChevronUp, Layers } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { TechBadge } from '@/components/shared/TechBadge'
import { cn } from '@/lib/utils'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import type { Project } from '@/types/portfolio'

function ProjectDescription({ description, isExpanded, onToggle }: { description: string, isExpanded: boolean, onToggle?: () => void }) {
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
          <button
            onClick={onToggle}
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium cursor-pointer bg-transparent border-none p-0"
          >
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
          </button>

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

interface StackImageProps {
  src: string
  alt: string
  index: number
  total: number
  progress: MotionValue<number>
  stackStart: number
  stackDuration: number
}

function StackImage({ src, alt, index, total, progress, stackStart, stackDuration }: StackImageProps) {
  const ANIM_RATIO = 0.3
  const slotStart = stackStart + ((index - 1) / (total - 1)) * stackDuration
  const slotEnd = stackStart + (index / (total - 1)) * stackDuration
  const animStart = slotStart
  const animEnd = slotStart + (slotEnd - slotStart) * ANIM_RATIO

  const y = useTransform(progress, [animStart, animEnd], ["120%", "0%"])
  const rotate = useTransform(progress, [animStart, animEnd], [index % 2 === 0 ? -2 : 2, 0])
  const scale = useTransform(progress, [animStart, animEnd], [0.95, 1])

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover will-change-transform"
      style={{
        y,
        rotate,
        scale,
        zIndex: index + 1,
        boxShadow: index > 0 ? '0 -20px 40px -10px rgba(0,0,0,0.8)' : 'none'
      }}
    />
  )
}

interface ImageStackProps {
  images: string[]
  alt: string
  progress: MotionValue<number>
  stackStart: number
  stackEnd: number
}

function ImageStack({ images, alt, progress, stackStart, stackEnd }: ImageStackProps) {
  const N = images.length
  const stackDuration = stackEnd - stackStart

  const activeIndex = useTransform(progress, (p: number) => {
    if (p < stackStart) return 0
    if (p > stackEnd) return N - 1
    const normalized = (p - stackStart) / stackDuration
    return Math.min(N - 1, Math.round(normalized * (N - 1)))
  })

  const barWidth = useTransform(progress, [stackStart, stackEnd], ["0%", "100%"])
  const counterValue = useTransform(activeIndex, v => v + 1)

  return (
    <div
      className="relative aspect-[4/3] md:aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/30 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] touch-none md:touch-auto"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* First image is always visible */}
      <img
        src={images[0]}
        alt={`${alt} - 1`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      />
      {images.slice(1).map((src, i) => (
        <StackImage
          key={src}
          src={src}
          alt={`${alt} - ${i + 2}`}
          index={i + 1}
          total={N}
          progress={progress}
          stackStart={stackStart}
          stackDuration={stackEnd - stackStart}
        />
      ))}

      {N > 1 && (
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-mono font-medium border border-white/10 z-50 pointer-events-none shadow-lg flex items-center gap-1.5">
          <Layers className="h-3 w-3 text-primary" />
          <motion.span>{counterValue}</motion.span>
          <span>/ {N}</span>
        </div>
      )}

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

// Animation timeline (scroll progress 0 -> 1)
const TIMELINE = {
  enter: { start: 0, end: 0.08 },
  fadeIn: { start: 0, end: 0.05 },
  detailsIn: { start: 0.08, end: 0.14 },
  expand: { start: 0.14, end: 0.90 },
  stack: { start: 0.25, end: 0.70 },
  collapse: { start: 0.90, end: 0.93 },
  detailsOut: { start: 0.93, end: 0.96 },
  exit: { start: 0.96, end: 1.0 },
}

interface ScrollProjectProps {
  project: Project
  index: number
  isLast: boolean
}

function ScrollProject({ project, index, isLast }: ScrollProjectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track raw scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const fromLeft = index % 2 === 0
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const N = project.images.length

  // Smooth the scroll progress: mass makes it heavier/slower to respond to fast scroll changes
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 50 : 80,
    damping: isMobile ? 60 : 50,
    mass: isMobile ? 1.5 : 1,
    restDelta: 0.001
  })

  const cardX = useTransform(
    smoothProgress,
    [TIMELINE.enter.start, TIMELINE.enter.end],
    [isMobile ? "0%" : (fromLeft ? "-100%" : "100%"), "0%"]
  )

  const cardYEnter = useTransform(
    smoothProgress,
    [TIMELINE.enter.start, TIMELINE.enter.end],
    [isMobile ? "50%" : "0%", "0%"]
  )

  const cardYExit = useTransform(
    smoothProgress,
    [TIMELINE.exit.start, TIMELINE.exit.end],
    isLast ? ["0%", "0%"] : ["0%", "-100%"]
  )

  const cardY = useTransform(
    [cardYEnter, cardYExit],
    ([enter, exit]) => {
      if (enter !== "0%") return enter
      return exit
    }
  )

  const cardScale = useTransform(
    smoothProgress,
    [TIMELINE.enter.start, TIMELINE.enter.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isLast ? [0.8, 1, 1, 1] : [0.8, 1, 1, 0.9]
  )

  const cardOpacity = useTransform(
    smoothProgress,
    [TIMELINE.fadeIn.start, TIMELINE.fadeIn.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  )

  const detailsOpacity = useTransform(
    smoothProgress,
    [TIMELINE.detailsIn.start, TIMELINE.detailsIn.end, TIMELINE.detailsOut.start, TIMELINE.detailsOut.end],
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  )

  const detailsX = useTransform(
    smoothProgress,
    [TIMELINE.detailsIn.start, TIMELINE.detailsIn.end, TIMELINE.detailsOut.start, TIMELINE.detailsOut.end],
    isLast
      ? [isMobile ? 0 : (fromLeft ? -30 : 30), 0, 0, 0]
      : [isMobile ? 0 : (fromLeft ? -30 : 30), 0, 0, isMobile ? 0 : (fromLeft ? -30 : 30)]
  )

  const detailsY = useTransform(
    smoothProgress,
    [TIMELINE.detailsIn.start, TIMELINE.detailsIn.end, TIMELINE.detailsOut.start, TIMELINE.detailsOut.end],
    isLast
      ? [isMobile ? 30 : 0, 0, 0, 0]
      : [isMobile ? 30 : 0, 0, 0, isMobile ? -30 : 0]
  )

  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (isMobile) {
        if (latest > TIMELINE.exit.start || latest < TIMELINE.fadeIn.end) {
          setIsExpanded(false)
        }
        return
      }
      const shouldBeExpanded = isLast
        ? latest > TIMELINE.expand.start
        : latest > TIMELINE.expand.start && latest < TIMELINE.collapse.start
      setIsExpanded(prev => prev !== shouldBeExpanded ? shouldBeExpanded : prev)
    })
    return unsubscribe
  }, [smoothProgress, isMobile])

  const handleToggle = () => {
    setIsExpanded(prev => !prev)
  }

  // All cards use identical height formula for consistent scroll experience
  const baseHeight = isMobile ? 400 : 140
  const perImage = isMobile ? 80 : 25
  const exitPadding = isMobile ? 80 : 40
  const sectionHeight = `${baseHeight + (N * perImage) + exitPadding}vh`

  return (
    <div ref={containerRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 md:px-8 md:overflow-hidden">
        <motion.article
          className="relative w-full max-w-6xl rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl md:overflow-hidden will-change-transform"
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

          {/* Mobile: flex-col with sticky image; Desktop: 2-col grid */}
          <div className="relative flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8 md:items-center p-4 md:p-8 lg:p-12 md:max-h-[90vh] md:overflow-y-auto hide-scrollbar">

            {/* Image stack - sticky on mobile */}
            <div className={cn(
              'w-full sticky top-0 z-10 bg-background/80 backdrop-blur-sm md:static md:bg-transparent md:backdrop-blur-none md:flex-shrink-0',
              index % 2 === 1 && 'md:order-2'
            )}>
              <div className="w-full aspect-[4/3] md:aspect-auto md:max-h-none overflow-hidden">
                <ImageStack
                  images={project.images}
                  alt={project.title}
                  progress={smoothProgress}
                  stackStart={TIMELINE.stack.start}
                  stackEnd={TIMELINE.stack.end}
                />
              </div>
            </div>

            {/* Details - natural flow on mobile */}
            <motion.div
              className={cn(
                'flex flex-col space-y-4 md:space-y-5 justify-center w-full md:flex-1 md:min-h-0',
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

              <ProjectDescription description={project.description} isExpanded={isExpanded} onToggle={handleToggle} />
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
        <ScrollProject key={project.id} project={project} index={index} isLast={index === projects.length - 1} />
      ))}

      <div className="h-24 md:h-32" />
    </section>
  )
}
