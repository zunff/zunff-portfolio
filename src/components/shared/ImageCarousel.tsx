import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from '@/components/ui/dialog'

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const handleImageLoad = (src: string) => {
    setLoadedImages((prev) => new Set(prev).add(src))
  }

  const openModal = () => setIsModalOpen(true)

  useEffect(() => {
    if (isPaused || images.length <= 1) return

    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [isPaused, goToNext, images.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return
      if (e.key === 'ArrowLeft') goToPrev()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen, goToPrev, goToNext])

  if (images.length === 0) return null

  return (
    <>
      <div
        className={cn('group relative overflow-hidden rounded-lg bg-secondary/30', className)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="aspect-video w-full overflow-hidden">
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`${alt} - ${index + 1}`}
              loading="lazy"
              decoding="async"
              onLoad={() => handleImageLoad(src)}
              onClick={openModal}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out cursor-pointer',
                index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
                !loadedImages.has(src) && 'animate-pulse bg-muted'
              )}
            />
          ))}
          {!loadedImages.has(images[currentIndex]) && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm p-2 text-foreground opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-200 hover:bg-background cursor-pointer border border-border/50"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm p-2 text-foreground opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all duration-200 hover:bg-background cursor-pointer border border-border/50"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  goToSlide(index)
                }}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200',
                  index === currentIndex
                    ? 'w-4 bg-primary'
                    : 'w-1.5 bg-foreground/30 hover:bg-foreground/50 cursor-pointer'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogPortal>
          <DialogOverlay className="backdrop-blur-sm" />
          <DialogPrimitive.Content
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogClose className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer border border-white/10 z-10">
              <ChevronRight className="h-5 w-5 rotate-45" />
            </DialogClose>

            {/* Image container with max constraints */}
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={images[currentIndex]}
                alt={`${alt} - ${currentIndex + 1}`}
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrev()
                  }}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-sm text-white/70 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <span className="font-medium">{currentIndex + 1}</span>
              <span className="text-white/40">/</span>
              <span>{images.length}</span>
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </>
  )
}
