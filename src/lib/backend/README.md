# Backend Service Wrapper

这个模块为Cloudbase提供了一个抽象层，便于未来切换到其他后端SDK。

## 架构

- `BackendService` 接口：定义了所有后端操作的标准接口
- `CloudbaseBackendService` 类：Cloudbase的具体实现
- `BackendServiceFactory` 类：用于创建和管理backend service实例

## 使用方法

### 基本使用

```typescript
import { getBackendService } from '$lib'

// 获取backend service实例
const backend = getBackendService()

// 使用认证功能
await backend.signIn({ username: 'user', password: 'pass' })
const loginState = await backend.getLoginState()

// 使用数据操作功能
const posts = await backend.getBlogPosts({
  pageNumber: 1,
  pageSize: 10,
  getCount: true
})

const newPost = await backend.createBlogPost({
  title: '新文章',
  content: '文章内容',
  public: false,
  createBy: userId
})
```

## 切换到其他后端SDK

要切换到其他后端SDK（如Firebase、Supabase等），需要：

1. 创建新的实现类，实现 `BackendService` 接口
2. 在 `BackendServiceFactory.create()` 方法中添加新的条件
3. 更新环境变量或配置

### 示例：添加Firebase支持

```typescript
// src/lib/backend/firebase.ts
import { BackendService, BlogPost, BlogPostListResponse, LoginState, AuthCredentials } from '../types'

export class FirebaseBackendService implements BackendService {
  // 实现所有BackendService接口方法
  async signIn(credentials: AuthCredentials): Promise<void> {
    // Firebase认证实现
  }

  async getBlogPosts(options: any): Promise<BlogPostListResponse> {
    // Firebase数据查询实现
  }

  // ... 其他方法
}

// src/lib/backend/index.ts
export class BackendServiceFactory {
  static create(env: string, provider: 'cloudbase' | 'firebase' = 'cloudbase'): BackendService {
    switch (provider) {
      case 'firebase':
        return new FirebaseBackendService(env)
      case 'cloudbase':
      default:
        return new CloudbaseBackendService(env)
    }
  }
}
```

## 接口定义

### BackendService

```typescript
interface BackendService {
  // 认证方法
  signIn(credentials: AuthCredentials): Promise<void>
  signOut(): Promise<void>
  getLoginState(): Promise<LoginState | null>
  signInAnonymously(): Promise<void>

  // 博客数据操作方法
  getBlogPosts(options: GetBlogPostsOptions): Promise<BlogPostListResponse>
  createBlogPost(post: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost>
  updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void>
  deleteBlogPost(id: string): Promise<void>
  deleteBlogPosts(filter: any): Promise<void>
}
```

## 优势

1. **易于切换**：通过更改配置即可切换后端提供商
2. **统一接口**：所有后端操作使用相同的API
3. **类型安全**：完整的TypeScript类型定义
4. **向后兼容**：保留了原有的BaseSDK作为兼容层
5. **可扩展**：轻松添加新的后端提供商支持

## 迁移指南

现有的代码已经更新为使用新的wrapper。如果需要回滚，可以：

1. 将所有 `getBackendService()` 调用替换回 `BaseSDK.cb()` 或 `BaseSDK.auth()`
2. 或者保持wrapper但在工厂中切换回旧的实现

## 注意事项

- 确保所有新的后端实现都完全实现 `BackendService` 接口
- 测试所有功能在切换后端时正常工作
- 更新相关的环境变量和配置