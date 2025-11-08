// 简单的测试文件来验证wrapper功能
import { BackendServiceFactory } from './index'
import { CB_ENV } from '../index'

// 测试函数
export async function testBackendWrapper() {
  console.log('Testing backend wrapper...')

  try {
    // 创建backend service实例
    const backend = BackendServiceFactory.create(CB_ENV)
    console.log('Backend service created successfully')

    // 测试获取登录状态
    const loginState = await backend.getLoginState()
    console.log('Login state:', loginState)

    // 测试获取博客文章（如果有权限）
    const posts = await backend.getBlogPosts({
      pageNumber: 1,
      pageSize: 5,
      getCount: true
    })
    console.log('Blog posts:', posts)

    console.log('All tests passed!')
    return true
  } catch (error) {
    console.error('Test failed:', error)
    return false
  }
}