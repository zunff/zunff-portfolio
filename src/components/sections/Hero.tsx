import { useState } from 'react'
import { Github, Mail, Phone, Check, LucideIcon, Code2 } from 'lucide-react'
import { portfolioConfig } from '@/config/portfolio.config'
import { motion } from 'framer-motion'

interface CopyButtonProps {
  icon: LucideIcon
  label: string
  value: string
  displayValue?: string
  variant?: 'default' | 'primary'
}

function CopyButton({ icon: Icon, label, value, displayValue, variant = 'default' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setShowTooltip(true)
      setTimeout(() => {
        setCopied(false)
        setShowTooltip(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleTouchStart = () => setShowTooltip(true)
  const handleTouchEnd = () => {
    if (!copied) {
      setTimeout(() => setShowTooltip(false), 1500)
    }
  }

  const baseStyles = "flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer min-w-[100px] sm:min-w-[120px]"
  const variantStyles = variant === 'primary'
    ? "border border-primary/30 text-primary bg-primary/10 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
    : "bg-white/5 border border-white/10 text-foreground backdrop-blur-sm hover:bg-primary/20 hover:border-primary/50 hover:text-primary"

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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

      {(showTooltip || copied) && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10">
          <div className="px-3 py-1.5 rounded-md bg-card border border-border shadow-lg whitespace-nowrap">
            <p className="text-sm text-foreground font-medium">{displayValue || value}</p>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border" />
        </div>
      )}
    </div>
  )
}

export default function Hero() {
  const { personal } = portfolioConfig
  const { name, nameEn, bio, techStack, social } = personal

  return (
    <section className="relative py-16 md:py-20 lg:py-24 px-4 md:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid gap-8 lg:gap-10 items-start">
          {/* Header row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              {name}
            </h1>
            {nameEn && (
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-primary font-mono">
                @{nameEn}
              </p>
            )}
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            {bio}
          </motion.p>

          {/* Tech stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-foreground/80 font-medium backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-primary/30"
                >
                  <Code2 className="h-3.5 w-3.5 text-primary" />
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Contact section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3"
          >
            <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
              Contact
            </h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  className="group flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-primary/20 hover:border-primary/50 hover:text-primary cursor-pointer"
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}