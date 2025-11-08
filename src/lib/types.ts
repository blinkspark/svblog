// 博客文章相关类型定义
export interface BlogPost {
  _id: string
  title: string
  content: string
  public: boolean
  createdAt: Date
  updatedAt: Date
  createBy: string
}

// API响应类型
export interface BlogPostListResponse {
  data: {
    records: BlogPost[]
    total: number
  }
}

// 认证相关类型
export interface LoginState {
  isAnonymous: boolean
  loginType: string
  user: {
    uid: string
    [key: string]: any
  } | null
}

export interface AuthCredentials {
  username: string
  password: string
}

// Backend Service 接口定义
export interface BackendService {
  // 认证方法
  signIn(credentials: AuthCredentials): Promise<void>
  signOut(): Promise<void>
  getLoginState(): Promise<LoginState | null>
  signInAnonymously(): Promise<void>

  // 博客数据操作方法
  getBlogPosts(options: {
    pageNumber: number
    pageSize: number
    filter?: any
    orderBy?: any[]
    getCount?: boolean
  }): Promise<BlogPostListResponse>

  createBlogPost(post: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost>

  updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void>

  deleteBlogPost(id: string): Promise<void>

  deleteBlogPosts(filter: any): Promise<void>
}
