import type { BackendService } from '../types'
import { CloudbaseBackendService } from './cloudbase'

// Backend service factory
export class BackendServiceFactory {
  private static instance: BackendService | null = null

  static create(env: string): BackendService {
    if (!this.instance) {
      this.instance = new CloudbaseBackendService(env)
    }
    return this.instance
  }

  static getInstance(): BackendService | null {
    return this.instance
  }
}

// Export types and classes
export type { BackendService } from '../types'
export { CloudbaseBackendService }