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
