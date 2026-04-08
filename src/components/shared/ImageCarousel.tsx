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

  useEffect(() => {
    if (isPaused || images.length <= 1) return

    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [isPaused, goToNext, images.length])

  if (images.length === 0) return null

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg bg-secondary/30', className)}
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
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out',
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
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm p-2 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background cursor-pointer border border-border/50"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm p-2 text-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background cursor-pointer border border-border/50"
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
  )
}
