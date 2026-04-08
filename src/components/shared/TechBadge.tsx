import { cn } from '@/lib/utils'

interface TechBadgeProps {
  tech: string
  className?: string
}

export function TechBadge({ tech, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-secondary/60 border border-border/60 px-2.5 py-1 text-xs font-medium text-foreground/80 transition-colors duration-200',
        className
      )}
    >
      {tech}
    </span>
  )
}
