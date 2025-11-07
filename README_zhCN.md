## 项目概述
这是一个基于 SvelteKit 构建的博客系统，名为 svblog。项目使用了 Svelte 5 的最新特性，包括新的响应式状态 API（$state）和现代的组件渲染方式（$props）。项目支持用户登录、博客文章的创建、编辑、发布和阅读功能。

## 技术栈
- **前端框架**: SvelteKit (Svelte 5)
- **UI 框架**: Bulma CSS
- **Markdown 处理**: svelte-exmarkdown
- **图标**: @iconify/svelte
- **后端服务**: 
  - 腾讯云开发 (@cloudbase/js-sdk)

- **开发工具**: TypeScript, Vite

## 部署指南

### 环境要求
- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

### 本地部署
1. 克隆项目到本地：
   ```bash
   git clone <项目仓库地址>
   cd svblog
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   创建 `.env` 文件，并添加以下环境变量：
   ```
   PUBLIC_TENCENT_CLOUD_APP_ID=<腾讯云应用ID>
   PUBLIC_TENCENT_CLOUD_SECRET_KEY=<腾讯云密钥>
   ```

4. 运行开发服务器：
   ```bash
   npm run dev
   ```

5. 访问应用：
   打开浏览器访问 http://localhost:5173

### 生产部署

#### 1. 构建应用
```bash
npm run build
```

#### 2. 部署选项

##### Vercel 部署
1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 部署完成

##### Netlify 部署
1. 构建命令：`npm run build`
2. 发布目录：`build`
3. 配置环境变量

##### 自定义服务器部署
1. 将构建产物（build目录）上传到服务器
2. 配置 Nginx 或 Apache 作为静态文件服务器
3. 配置反向代理（如需）

#### 3. 环境变量配置
生产环境需要配置以下环境变量：
- `PUBLIC_TENCENT_CLOUD_APP_ID`: 腾讯云应用ID
- `PUBLIC_TENCENT_CLOUD_SECRET_KEY`: 腾讯云密钥

### 常见问题

1. **构建失败**：确保 Node.js 版本符合要求，并清除 node_modules 后重新安装

2. **样式丢失**：检查 Bulma CSS 是否正确引入

3. **API 连接失败**：确认环境变量配置正确，后端服务正常运行