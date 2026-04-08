import type { PortfolioConfig } from '@/types/portfolio'

export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: 'Your Name',
    avatar: '/images/avatar.svg',
    bio: 'Full Stack Developer | 热爱技术，专注于构建优雅的解决方案',
    techStack: [
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'PostgreSQL',
      'Docker',
    ],
    social: {
      github: 'https://github.com/yourusername',
      email: 'your.email@example.com',
    },
  },
  projects: [
    {
      id: 'project-1',
      title: '项目名称 One',
      summary: '一个简洁的项目描述，一句话说明项目核心价值',
      techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      images: [
        '/images/projects/project-1/1.svg',
        '/images/projects/project-1/2.svg',
        '/images/projects/project-1/3.svg',
      ],
      description:
        '这是项目的详细描述。可以多行文本，介绍项目的背景、功能特点、技术亮点等。支持多段落描述。',
      github: 'https://github.com/yourusername/project-1',
      demo: 'https://project-1.demo.com',
    },
    {
      id: 'project-2',
      title: '项目名称 Two',
      summary: '另一个项目简介，突出技术栈和核心功能',
      techStack: ['Node.js', 'Express', 'MongoDB', 'Redis'],
      images: [
        '/images/projects/project-2/1.svg',
        '/images/projects/project-2/2.svg',
      ],
      description:
        '后端服务项目，提供 RESTful API。采用分层架构，支持高并发场景。',
      github: 'https://github.com/yourusername/project-2',
    },
    {
      id: 'project-3',
      title: '项目名称 Three',
      summary: '全栈应用，前后端一体化解决方案',
      techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Vercel'],
      images: [
        '/images/projects/project-3/1.svg',
        '/images/projects/project-3/2.svg',
        '/images/projects/project-3/3.svg',
        '/images/projects/project-3/4.svg',
      ],
      description:
        '全栈应用项目，使用 Next.js 实现服务端渲染，Prisma 作为 ORM，部署在 Vercel。',
      github: 'https://github.com/yourusername/project-3',
      demo: 'https://project-3.demo.com',
    },
  ],
}
