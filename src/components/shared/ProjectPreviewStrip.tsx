import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface ProjectPreviewStripProps {
  images: string[]
}

export function ProjectPreviewStrip({ images }: ProjectPreviewStripProps) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-100px' })

  if (!images.length) return null

  const imageWidth = 320
  const totalWidth = images.length * (imageWidth + 24)
  const offset = totalWidth

  return (
    <section ref={ref} className="relative h-48 md:h-64 -mt-8 md:-mt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20 md:opacity-30">
        <motion.div
          className="flex gap-6 absolute top-8 md:top-12 left-0"
          animate={isInView ? { x: [0, -offset] } : {}}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
        >
          {[...images, ...images].map((img, idx) => (
            <motion.img
              key={idx}
              src={img}
              alt={`Project preview ${(idx % images.length) + 1}`}
              loading="eager"
              decoding="async"
              className="w-72 md:w-80 h-auto object-cover rounded-xl shadow-2xl flex-shrink-0"
              animate={isInView ? { y: [0, -12, 0] } : {}}
              transition={{
                duration: 3 + (idx % 3),
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1],
                delay: idx * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}