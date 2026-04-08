import { Github, ExternalLink } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TechBadge } from '@/components/shared/TechBadge'
import { ImageCarousel } from '@/components/shared/ImageCarousel'

export default function Projects() {
  const { projects } = portfolioConfig

  return (
    <section>
      <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-left">
        Projects
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-foreground">
                {project.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{project.summary}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4">
              {/* Image Carousel */}
              <ImageCarousel
                images={project.images}
                alt={project.title}
                className="group border border-border/50"
              />

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <TechBadge key={tech} tech={tech} />
                ))}
              </div>

              {/* Description */}
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                {project.demo && (
                  <Button size="sm" asChild>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
