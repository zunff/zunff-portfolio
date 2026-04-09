import { useState } from 'react'
import { Github, ExternalLink, Folder, ChevronDown, ChevronUp } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { TechBadge } from '@/components/shared/TechBadge'
import { ImageCarousel } from '@/components/shared/ImageCarousel'
import { cn } from '@/lib/utils'

function ProjectDescription({ description }: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
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
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer font-medium"
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
              "overflow-hidden transition-all duration-300 ease-in-out",
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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

export default function Projects() {
  const { projects } = portfolioConfig

  return (
    <section className="relative pb-20 md:pb-32 lg:pb-40 px-4 md:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-12 md:mb-16">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Projects
          </h2>
        </div>

        <div className="space-y-8 md:space-y-12">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className={cn(
                "group relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden transition-all duration-300",
                "hover:border-primary/30 hover:bg-card/80"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative grid md:grid-cols-2 gap-0">
                <div className={cn("p-6 md:p-8", index % 2 === 1 && "md:order-2")}>
                  <div className="relative rounded-xl overflow-hidden border border-border/50 group/img">
                    <ImageCarousel
                      images={project.images}
                      alt={project.title}
                      className="aspect-video"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                <div className={cn(
                  "flex flex-col p-6 md:p-8 space-y-4",
                  index % 2 === 1 && "md:order-1"
                )}>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h3>
                    <div className="flex gap-2 flex-shrink-0">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2.5 sm:p-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:text-primary cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`View ${project.title} on GitHub`}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2.5 sm:p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                          aria-label={`View ${project.title} demo`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <TechBadge key={tech} tech={tech} />
                    ))}
                  </div>

                  <div className="flex-1" />

                  <ProjectDescription description={project.description} />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
