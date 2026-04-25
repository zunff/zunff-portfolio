import { useRef, useState, useEffect } from 'react'
import { Github, ExternalLink, Folder, ChevronDown, ChevronUp, Layers, ArrowDown } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { TechBadge } from '@/components/shared/TechBadge'
import { cn } from '@/lib/utils'
import { motion, useScroll, useTransform, useMotionValue, animate, MotionValue } from 'framer-motion'
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
  stackEnd: number
}

function StackImage({ src, alt, index, total, progress, stackStart, stackEnd }: StackImageProps) {
  const ANIM_RATIO = 0.3
  const stepPerImage = (stackEnd - stackStart) / total
  const slotStart = stackStart + (index * stepPerImage)
  const slotEnd = stackStart + ((index + 1) * stepPerImage)
  const animStart = slotStart
  const animEnd = slotStart + (slotEnd - slotStart) * ANIM_RATIO

  // Use percentage for y (need full container height to hide), px for rotate
  const y = useTransform(progress, [animStart, animEnd], ["120%", "0%"])
  const rotate = useTransform(progress, [animStart, animEnd], [index % 2 === 0 ? -2 : 2, 0])

  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
      style={{
        y,
        rotate,
        zIndex: index + 1,
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

  const activeIndex = useTransform(progress, (p: number) => {
    if (p < stackStart) return 0
    if (p >= stackEnd) return N - 1
    const normalized = (p - stackStart) / (stackEnd - stackStart)
    return Math.min(N - 1, Math.floor(normalized * N))
  })

  const barWidth = useTransform(progress, [stackStart, stackEnd], ["0%", "100%"])
  const counterValue = useTransform(activeIndex, v => v + 1)

  return (
    <div
      className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/30 touch-none md:touch-auto md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
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
          stackEnd={stackEnd}
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

// Fixed steps in viewport height (vh) for each phase
// These scale with image count to maintain consistent scroll experience
const FIXED_STEPS = {
  // Per image in the stack (vh of scroll distance)
  perImageVh: 40, // Each image needs 40vh of scroll
  // Other phases - base values that scale with image count
  enterBase: 40, // Base height for entry animation
  detailsInBase: 40,
  detailsOutBase: 100,
  exitBase: 100, // Base height for exit animation
}

interface ScrollProjectProps {
  project: Project
  index: number
  isLast: boolean
}

function ScrollProject({ project, index, isLast }: ScrollProjectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const techStackRef = useRef<HTMLDivElement>(null)
  const lastProgressRef = useRef(0)
  const lastTimeRef = useRef(Date.now())
  const isSnappedRef = useRef(false)
  const snapLockRef = useRef(false)

  // Track raw scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Create a controlled motion value for smooth progress with snap behavior
  const smoothProgress = useMotionValue(0)

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

  // Calculate total viewport height needed for this project
  // Enter/exit phases scale with image count to maintain good pacing
  const scaleFactor = 1 + (N - 1) * 0.3 // Scale up with more images
  const enterVh = FIXED_STEPS.enterBase * scaleFactor
  const detailsInVh = FIXED_STEPS.detailsInBase
  const stackVh = N * FIXED_STEPS.perImageVh
  const detailsOutVh = FIXED_STEPS.detailsOutBase
  const exitVh = FIXED_STEPS.exitBase * scaleFactor

  const totalVh = enterVh + detailsInVh + stackVh + detailsOutVh + exitVh
  const sectionHeight = `${totalVh}vh`

  // Calculate dynamic timeline percentages
  const enterPercent = enterVh / totalVh
  const detailsInPercent = detailsInVh / totalVh
  const stackPercent = stackVh / totalVh
  const exitPercent = exitVh / totalVh

  const TIMELINE = {
    enter: { start: 0, end: enterPercent },
    fadeIn: { start: 0, end: enterPercent * 0.6 },
    detailsIn: { start: enterPercent, end: enterPercent + detailsInPercent },
    stack: { start: enterPercent + detailsInPercent, end: enterPercent + detailsInPercent + stackPercent },
    exit: { start: 1 - exitPercent, end: 1.0 },
  }

  // Snap point at the start of stack phase (when card is fully expanded)
  const snapPoint = TIMELINE.stack.start
  const snapThreshold = 0.03 // Distance to trigger snap behavior
  const snapForce = 0.01 // Required velocity to break out of snap

  // Implement snap logic with scroll velocity detection
  useEffect(() => {
    let rafId: number | null = null
    let pendingUpdate = false

    const updateProgress = (latest: number) => {
      if (pendingUpdate) return
      pendingUpdate = true

      rafId = requestAnimationFrame(() => {
        const now = Date.now()
        const deltaTime = now - lastTimeRef.current
        const deltaProgress = latest - lastProgressRef.current
        const velocity = deltaTime > 0 ? Math.abs(deltaProgress / deltaTime) : 0

        const distanceFromSnap = latest - snapPoint
        const absDistance = Math.abs(distanceFromSnap)

        // Check if we're near the snap point
        if (absDistance < snapThreshold && latest > TIMELINE.detailsIn.start) {
          // If currently snapped and user scrolls with enough force, unlock
          if (isSnappedRef.current) {
            if (velocity > snapForce || (latest > snapPoint && distanceFromSnap > 0.005)) {
              isSnappedRef.current = false
              snapLockRef.current = true
              animate(smoothProgress, latest, { type: 'spring', stiffness: 300, damping: 30 })
            } else {
              // Stay snapped
              smoothProgress.set(snapPoint)
            }
          } else {
            // Not snapped yet - check if we should snap
            if (velocity < snapForce && distanceFromSnap > -0.015 && distanceFromSnap < 0.005) {
              // Snap to point
              isSnappedRef.current = true
              animate(smoothProgress, snapPoint, { type: 'spring', stiffness: 200, damping: 25 })
            } else {
              // Continue scrolling normally
              smoothProgress.set(latest)
            }
          }
        } else {
          // Outside snap zone - normal scrolling
          if (!snapLockRef.current || absDistance > snapThreshold * 1.5) {
            snapLockRef.current = false
            smoothProgress.set(latest)
          }
        }

        lastProgressRef.current = latest
        lastTimeRef.current = now
        pendingUpdate = false
      })
    }

    const unsubscribe = scrollYProgress.on("change", updateProgress)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      unsubscribe()
    }
  }, [scrollYProgress, smoothProgress, snapPoint, snapThreshold, TIMELINE])

  // Desktop: enter from left/right (x-axis), exit upward (y-axis)
  // Mobile: all on y-axis
  // Use viewport-based pixel values for Safari performance (avoids % in transforms)
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1080

  const cardTranslateX = useTransform(
    smoothProgress,
    [TIMELINE.enter.start, TIMELINE.enter.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isMobile
      ? [0, 0, 0, 0]
      : [fromLeft ? -viewportWidth : viewportWidth, 0, 0, 0]
  )

  const cardTranslateY = useTransform(
    smoothProgress,
    [TIMELINE.enter.start, TIMELINE.enter.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isMobile
      ? [viewportHeight * 0.5, 0, 0, -viewportHeight]
      : [0, 0, 0, isLast ? 0 : -viewportHeight * 0.6]
  )

  const cardScale = useTransform(
    smoothProgress,
    [TIMELINE.enter.start, TIMELINE.enter.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isLast ? [0.85, 1, 1, 1] : [0.85, 1, 1, 0.9]
  )

  const cardOpacity = useTransform(
    smoothProgress,
    [TIMELINE.fadeIn.start, TIMELINE.fadeIn.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  )

  const detailsOpacity = useTransform(
    smoothProgress,
    [TIMELINE.detailsIn.start, TIMELINE.detailsIn.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  )

  const detailsX = useTransform(
    smoothProgress,
    [TIMELINE.detailsIn.start, TIMELINE.detailsIn.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isLast
      ? [isMobile ? 0 : (fromLeft ? -30 : 30), 0, 0, 0]
      : [isMobile ? 0 : (fromLeft ? -30 : 30), 0, 0, isMobile ? 0 : (fromLeft ? -30 : 30)]
  )

  const detailsY = useTransform(
    smoothProgress,
    [TIMELINE.detailsIn.start, TIMELINE.detailsIn.end, TIMELINE.exit.start, TIMELINE.exit.end],
    isLast
      ? [isMobile ? 30 : 0, 0, 0, 0]
      : [isMobile ? 30 : 0, 0, 0, isMobile ? -30 : 0]
  )

  const [isExpanded, setIsExpanded] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (isMobile) {
        if (latest > TIMELINE.exit.start || latest < TIMELINE.fadeIn.end) {
          setIsExpanded(false)
        }
        return
      }
      // Skip auto-control if user recently interacted
      if (userInteracted) return

      const shouldBeExpanded = isLast
        ? latest > TIMELINE.detailsIn.end
        : latest > TIMELINE.detailsIn.end && latest < TIMELINE.exit.start
      setIsExpanded(prev => prev !== shouldBeExpanded ? shouldBeExpanded : prev)
    })
    return () => unsubscribe()
  }, [smoothProgress, isMobile, userInteracted, isLast, TIMELINE])

  const handleToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    setUserInteracted(true)
    // Reset after 3 seconds to re-enable auto-control
    setTimeout(() => setUserInteracted(false), 3000)
  }

  // Collapse details when user swipes to scroll on mobile
  useEffect(() => {
    if (!isMobile || !isExpanded) return

    const handleTouchMove = () => {
      setIsExpanded(false)
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => window.removeEventListener('touchmove', handleTouchMove)
  }, [isMobile, isExpanded])

  return (
    <div ref={containerRef} className="relative" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 md:px-8 md:overflow-hidden">
        <motion.article
          className="relative w-full max-w-6xl rounded-2xl border border-white/10 bg-white/[0.08] shadow-2xl overflow-hidden"
          style={{
            x: cardTranslateX,
            y: cardTranslateY,
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

            {/* Image stack - sticky on mobile, hidden when details expanded on mobile */}
            <div className={cn(
              'w-full md:static md:bg-transparent md:flex-shrink-0 transition-[max-height,opacity,margin] duration-300 ease-in-out overflow-hidden',
              // On mobile: sticky top-0 z-10 by default, hidden when expanded
              isExpanded && isMobile ? 'max-h-0 opacity-0 my-0 sticky top-0 z-10' : 'max-h-[999px] opacity-100 sticky top-0 z-10',
              index % 2 === 1 && 'md:order-2',
              'md:max-h-none md:opacity-100 md:transition-none md:overflow-visible'
            )}>
              <div className="w-full aspect-[16/9] md:aspect-auto md:max-h-none">
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
              <div
                className={cn(
                  'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:!grid-rows-[1fr] md:opacity-100 md:transition-none',
                  isExpanded && isMobile ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
                )}
              >
                <div className="overflow-hidden flex flex-col gap-4">
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

                  <div ref={techStackRef} className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <TechBadge key={tech} tech={tech} />
                    ))}
                  </div>
                </div>
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
  const containerRef = useRef<HTMLDivElement>(null)

  // Track scroll progress to show "reached bottom" message
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const [showBottomMessage, setShowBottomMessage] = useState(false)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Show message when scrolled past 95%
      setShowBottomMessage(latest > 0.95)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <section ref={containerRef} className="relative">
      {/* Section header */}
      <div className="relative py-12 md:py-16 px-4 md:px-8">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Folder className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Projects
            </h2>
          </motion.div>

          <motion.p
            className="text-muted-foreground text-base md:text-lg lg:text-xl mb-4 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Explore my latest work through an interactive showcase
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div
              className="flex flex-col items-center gap-1 text-muted-foreground"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              <span className="text-xs font-mono tracking-widest uppercase opacity-60">
                Scroll
              </span>
              <ArrowDown className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll-driven project sections */}
      {projects.map((project, index) => (
        <ScrollProject key={project.id} project={project} index={index} isLast={index === projects.length - 1} />
      ))}

      {/* Bottom message */}
      <motion.div
        className="py-16 md:py-24 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={showBottomMessage ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-lg md:text-xl text-muted-foreground/60 font-light">
          已经到底了哦～
        </p>
      </motion.div>

      <div className="h-24 md:h-32" />
    </section>
  )
}
