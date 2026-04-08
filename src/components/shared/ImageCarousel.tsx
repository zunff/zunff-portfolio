import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageCarouselProps {
  images: string[]
  alt: string
  className?: string
}

export function ImageCarousel({ images, alt, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

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

  // Auto-play with pause on hover
  useEffect(() => {
    if (isPaused || images.length <= 1) return

    const interval = setInterval(goToNext, 3000)
    return () => clearInterval(interval)
  }, [isPaused, goToNext, images.length])

  if (images.length === 0) return null

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image container */}
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {images.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`${alt} - ${index + 1}`}
            loading="lazy"
            decoding="async"
            onLoad={() => handleImageLoad(src)}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-500',
              index === currentIndex ? 'opacity-100' : 'opacity-0',
              !loadedImages.has(src) && 'animate-pulse bg-muted'
            )}
          />
        ))}
        {/* Skeleton placeholder for current image */}
        {!loadedImages.has(images[currentIndex]) && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrev()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots indicator */}
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
                'h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'w-4 bg-primary'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}