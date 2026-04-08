# Portfolio

程序员个人作品集网站，深色极简科技风格。

## 技术栈

- Vite 5
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 配置

### 个人信息

编辑 `src/config/portfolio.config.ts`：

```typescript
{
  personal: {
    name: 'Your Name',
    avatar: '/images/avatar.jpg',
    bio: '你的简介',
    techStack: ['TypeScript', 'React', 'Node.js'],
    social: {
      github: 'https://github.com/yourusername',
      email: 'your@email.com',
    },
  },
  // ...
}
```

### 项目配置

```typescript
{
  id: 'project-id',
  title: '项目名称',
  summary: '一句话简介',
  techStack: ['React', 'TypeScript'],
  images: [
    '/images/projects/project-1/1.webp',
    '/images/projects/project-1/2.webp',
  ],
  description: '项目详细描述',
  github: 'https://github.com/xxx/xxx',
  demo: 'https://demo.com', // 可选，不配置则不显示按钮
}
```

### 图片资源

将图片放入 `public/images/` 目录：

```
public/images/
├── avatar.jpg              # 个人头像
└── projects/
    ├── project-1/
    │   ├── 1.webp
    │   └── 2.webp
    └── project-2/
        └── ...
```

**建议**：使用 WebP 格式，推荐尺寸 800x450 (16:9)。

## 功能特性

- 深色极简科技风格
- 图片轮播（自动播放 + 悬停暂停）
- 图片懒加载 + 骨架屏
- 响应式布局
- 配置文件化管理

## License

MIT
