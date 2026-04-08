import { useState } from 'react'
import { Github, Mail } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { TechBadge } from '@/components/shared/TechBadge'
import { cn } from '@/lib/utils'

export default function Hero() {
  const { personal } = portfolioConfig
  const { name, avatar, bio, techStack, social } = personal
  const [avatarLoaded, setAvatarLoaded] = useState(false)

  return (
    <section className="mb-20 flex flex-col items-center gap-8 py-12 md:flex-row md:gap-12">
      {/* Avatar */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/50 to-accent/50 opacity-75 blur-lg" />
        {/* Skeleton */}
        {!avatarLoaded && (
          <div className="absolute inset-0 animate-pulse rounded-full bg-muted" />
        )}
        <img
          src={avatar}
          alt={name}
          loading="eager"
          decoding="async"
          onLoad={() => setAvatarLoaded(true)}
          className={cn(
            'relative h-40 w-40 rounded-full border-2 border-primary/30 object-cover md:h-48 md:w-48',
            !avatarLoaded && 'opacity-0'
          )}
        />
      </div>

      {/* Info */}
      <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {name}
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">{bio}</p>

        {/* Tech Stack */}
        <div className="flex flex-wrap justify-center gap-2 md:justify-start">
          {techStack.map((tech) => (
            <TechBadge key={tech} tech={tech} />
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-2 flex gap-4">
          {social.github && (
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="h-5 w-5" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
          )}
          {social.email && (
            <a
              href={`mailto:${social.email}`}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
            >
              <Mail className="h-5 w-5" />
              <span className="text-sm font-medium">Email</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
