import { useState } from 'react'
import { Github, Mail, Linkedin, Code2, Terminal, Phone, Check, LucideIcon } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'

interface CopyButtonProps {
  icon: LucideIcon
  label: string
  value: string
  displayValue?: string
  variant?: 'default' | 'primary'
}

function CopyButton({ icon: Icon, label, value, displayValue, variant = 'default' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const baseStyles = "flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer min-w-[100px] sm:min-w-[120px]"
  const variantStyles = variant === 'primary' 
    ? "border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground"
    : "bg-secondary/50 border border-border text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary"

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        aria-label={`Copy ${label}`}
        className={`${baseStyles} ${variantStyles}`}
      >
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">已复制</span>
          </>
        ) : (
          <>
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
          </>
        )}
      </button>
      
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-10">
        <div className="px-3 py-1.5 rounded-md bg-card border border-border shadow-lg whitespace-nowrap">
          <p className="text-sm text-foreground font-medium">{displayValue || value}</p>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border" />
      </div>
    </div>
  )
}

export default function Hero() {
  const { personal } = portfolioConfig
  const { name, nameEn, avatar, bio, techStack, social } = personal

  return (
    <section className="relative py-20 md:py-32 lg:py-40 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="grid gap-12 lg:gap-20 lg:grid-cols-[1fr,auto] items-center">
          <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                  {name}
                </h1>
                {nameEn && (
                  <p className="text-xl sm:text-2xl md:text-3xl font-medium text-muted-foreground font-mono">
                    @{nameEn}
                  </p>
                )}
              </div>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {bio}
            </p>

            <div className="flex flex-wrap gap-2">
              {techStack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-sm text-foreground/80 font-medium transition-colors hover:bg-secondary hover:border-primary/30 shrink-0"
                >
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                  {tech}
                </span>
              ))}
              {techStack.length > 5 && (
                <div className="relative group shrink-0">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/50 text-sm text-muted-foreground cursor-pointer transition-colors hover:bg-secondary/50 hover:text-foreground">
                    +{techStack.length - 5}
                  </span>
                  <div className="absolute left-0 top-full mt-2 pt-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-10">
                    <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-card border border-border shadow-lg max-w-xs">
                      {techStack.slice(5).map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-border text-xs text-foreground/80 font-medium"
                        >
                          <Code2 className="h-3 w-3 text-primary" />
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:text-primary cursor-pointer"
                >
                  <Github className="h-5 w-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              )}
              {social.phone && (
                <CopyButton
                  icon={Phone}
                  label="Phone"
                  value={social.phone.replace(/-/g, '')}
                  displayValue={social.phone}
                />
              )}
              {social.email && (
                <CopyButton
                  icon={Mail}
                  label="Contact"
                  value={social.email}
                  variant="primary"
                />
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  className="group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground transition-all duration-200 hover:bg-primary/10 hover:border-primary/50 hover:text-primary cursor-pointer"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl opacity-60" />
              <div className="relative p-1 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
                <img
                  src={avatar}
                  alt={name}
                  loading="eager"
                  decoding="async"
                  className="h-52 w-52 xl:h-60 xl:w-60 rounded-full object-cover bg-secondary"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
              <Terminal className="h-4 w-4 text-primary" />
              <span>Building the future</span>
            </div>
          </div>
        </div>

        <div className="lg:hidden flex flex-col items-center gap-6 mt-12">
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl opacity-60" />
            <div className="relative p-1 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent">
              <img
                src={avatar}
                alt={name}
                loading="eager"
                decoding="async"
                className="h-36 w-36 sm:h-44 sm:w-44 rounded-full object-cover bg-secondary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-mono">
            <Terminal className="h-4 w-4 text-primary" />
            <span>Building the future</span>
          </div>
        </div>
      </div>
    </section>
  )
}
