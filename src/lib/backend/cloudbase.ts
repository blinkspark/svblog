import cloudbase from '@cloudbase/js-sdk'
import type { BackendService, BlogPost, BlogPostListResponse, LoginState, AuthCredentials } from '../types'

export class CloudbaseBackendService implements BackendService {
  private app: cloudbase.app.App | null = null
  private authInstance: cloudbase.auth.App | null = null

  constructor(env: string) {
    this.app = cloudbase.init({
      env,
    })
  }

  private getAuth(): cloudbase.auth.App {
    if (!this.authInstance && this.app) {
      this.authInstance = this.app.auth()
    }
    return this.authInstance!
  }

  async signIn(credentials: AuthCredentials): Promise<void> {
    const auth = this.getAuth()
    await auth.signIn({
      username: credentials.username,
      password: credentials.password,
    })
  }

  async signOut(): Promise<void> {
    const auth = this.getAuth()
    await auth.signOut()
  }

  async getLoginState(): Promise<LoginState | null> {
    const auth = this.getAuth()
    const state = await auth.getLoginState()
    return state as LoginState | null
  }

  async signInAnonymously(): Promise<void> {
    const auth = this.getAuth()
    await auth.signInAnonymously()
  }

  async getBlogPosts(options: {
    pageNumber: number
    pageSize: number
    filter?: any
    orderBy?: any[]
    getCount?: boolean
  }): Promise<BlogPostListResponse> {
    if (!this.app) throw new Error('Cloudbase app not initialized')

    const result = await this.app.models.blogs.list({
      getCount: options.getCount ?? true,
      pageNumber: options.pageNumber,
      pageSize: options.pageSize,
      orderBy: options.orderBy,
      filter: options.filter,
    })

    return result as BlogPostListResponse
  }

  async createBlogPost(post: Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
    if (!this.app) throw new Error('Cloudbase app not initialized')

    const result = await this.app.models.blogs.create({ data: post })
    return result.data as unknown as BlogPost
  }

  async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<void> {
    if (!this.app) throw new Error('Cloudbase app not initialized')

    await this.app.models.blogs.update({
      data: post,
      filter: { where: { _id: { $eq: id } } }
    })
  }

  async deleteBlogPost(id: string): Promise<void> {
    if (!this.app) throw new Error('Cloudbase app not initialized')

    await this.app.models.blogs.delete({
      filter: { where: { _id: { $eq: id } } }
    })
  }

  async deleteBlogPosts(filter: any): Promise<void> {
    if (!this.app) throw new Error('Cloudbase app not initialized')

    await this.app.models.blogs.deleteMany({ filter })
  }
}