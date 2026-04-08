import type { PortfolioConfig } from '@/types/portfolio'

export const portfolioConfig: PortfolioConfig = {
  personal: {
    name: '翟俊槐',
    nameEn: 'zunff',
    avatar: '/images/avatar.svg',
    bio: 'Java后端开发（具备AI Agent全栈开发经验）',
    techStack: [
      'Java',
      'Spring Boot',
      'TypeScript',
      'React',
      'Python',
      'PostgreSQL',
      'Docker',
      'AI Agent',
    ],
    social: {
      github: 'https://github.com/zunff',
      email: 'zunff@example.com',
      phone: '138-8888-8888',
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
        '一个基于 React 生态的现代化前端项目，采用组件化架构设计和严格的类型检查，实现了高可维护性和出色的开发体验。通过 Vite 构建工具提供极速的开发服务器和优化的生产构建。\n\n项目背景：在企业级应用开发中，我们遇到了组件复用困难、状态管理复杂、类型安全不足等问题。该项目通过引入最佳实践和现代化工具链，构建了一套可扩展的前端解决方案。\n\n技术架构：采用 React 18 的并发特性，配合 TypeScript 提供完整的类型支持。使用 Zustand 进行轻量级状态管理，TanStack Query 处理服务端状态。组件库基于 Radix UI 原语构建，确保无障碍访问。\n\n性能优化：实现了路由级代码分割、图片懒加载、虚拟列表等性能优化策略。通过 Lighthouse CI 在每次构建时监控性能指标，确保 Core Web Vitals 达标。首屏加载时间控制在 2 秒内，Lighthouse 性能评分保持在 90+。',
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
        '一个高性能的后端服务项目，提供 RESTful API 接口，采用清晰的分层架构设计，支持高并发和水平扩展。通过 Docker 容器化部署，实现了环境一致性和快速交付。\n\n架构设计：采用经典的三层架构模式，Controller 层负责请求响应，Service 层处理业务逻辑，Repository 层封装数据访问。使用依赖注入实现松耦合，便于单元测试和模块替换。\n\n数据层方案：MongoDB 作为主数据库，支持灵活的文档模型和分片集群。Redis 作为缓存层和消息队列，显著降低了数据库压力。实现了多级缓存策略，热点数据命中率保持在 95% 以上。\n\n稳定性保障：集成 Prometheus + Grafana 监控体系，实现了接口耗时、错误率、QPS 等关键指标的实时监控。配置了告警规则，P99 延迟超过阈值时自动通知。通过压测验证，系统可支撑 10000+ QPS。',
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
        '一个全栈 Web 应用项目，使用 Next.js 14 的 App Router 架构，结合服务端渲染和静态生成技术，实现了优秀的 SEO 效果和极致的用户体验。通过 Prisma ORM 管理 PostgreSQL 数据库，提供类型安全的数据库操作。\n\n前端技术栈：采用 React Server Components 减少客户端 JavaScript 体积，使用 Client Components 处理交互逻辑。集成 Tailwind CSS 和 Framer Motion，实现流畅的动画效果。支持深色模式，尊重系统的外观偏好设置。\n\n后端架构：Next.js API Routes 提供 RESTful 接口，配合 Prisma ORM 实现数据库 CRUD 操作。使用 Server Actions 简化表单处理逻辑。实现了基于 JWT 的认证系统和基于角色的访问控制（RBAC）。\n\n部署方案：项目部署在 Vercel 平台，利用 Edge Network 实现全球加速。配置了自动化的 CI/CD 流程，每次代码提交自动运行测试和构建。集成了 Vercel Analytics 和 Sentry，实时监控性能指标和错误日志。',
      github: 'https://github.com/yourusername/project-3',
      demo: 'https://project-3.demo.com',
    },
  ],
}
