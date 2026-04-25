import { motion } from 'framer-motion'

interface ProjectPreviewStripProps {
  images: string[]
}

export function ProjectPreviewStrip({ images }: ProjectPreviewStripProps) {
  if (!images.length) return null

  // Calculate offset to ensure images loop smoothly
  // Each image is w-72 (288px) on mobile, w-80 (320px) on desktop, with gap-6 (24px)
  const imageWidth = 320 // Use desktop width for calculation
  const totalWidth = images.length * (imageWidth + 24) // width + gap
  const offset = totalWidth // Move full width to create seamless loop

  return (
    <section className="relative h-48 md:h-64 -mt-8 md:-mt-16 overflow-hidden">
      {/* Floating project images - horizontal swim */}
      <div className="absolute inset-0 pointer-events-none opacity-20 md:opacity-30">
        <motion.div
          className="flex gap-6 absolute top-8 md:top-12 left-0"
          animate={{
            x: [0, -offset]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
        >
          {/* Duplicate images for seamless loop */}
          {[...images, ...images].map((img, idx) => (
            <motion.img
              key={idx}
              src={img}
              alt={`Project preview ${(idx % images.length) + 1}`}
              className="w-72 md:w-80 h-auto object-cover rounded-xl shadow-2xl flex-shrink-0"
              animate={{
                y: [0, -12, 0],
              }}
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