export interface PortfolioConfig {
  title: string
  personal: PersonalInfo
  projects: Project[]
}

export interface PersonalInfo {
  name: string
  nameEn?: string
  avatar: string
  bio: string
  techStack: string[]
  social: SocialLinks
}

export interface SocialLinks {
  github?: string
  email?: string
  linkedin?: string
  phone?: string
}

export interface Project {
  id: string
  title: string
  summary: string
  techStack: string[]
  images: string[]
  description: string
  github: string
  demo?: string
}
