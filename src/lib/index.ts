// place files you want to import through the `$lib` alias in this folder.
import cloudbase from '@cloudbase/js-sdk'
import PocketBase from 'pocketbase'

// 导出类型定义
export type { BlogPost, BlogPostListResponse } from './types'

export const POSTS_PER_PAGE = 5
const BASE_URL = import.meta.env.VITE_BASE_URL

export const pb = new PocketBase(BASE_URL)

export const CB_ENV = import.meta.env.VITE_CB_ENV

let _cb: cloudbase.app.App | undefined = undefined
export function cb(): cloudbase.app.App | undefined {
  if (!_cb) {
    _cb = cloudbase.init({
      env: CB_ENV,
      // clientId: 'client_id',
    })
  }
  return _cb
}

let _auth: cloudbase.auth.App | undefined = undefined
export function auth(): cloudbase.auth.App | undefined {
  if (!_auth) {
    _auth = cb()?.auth()
  }
  return _auth
}

export class BaseSDK {
  static _cb: cloudbase.app.App | undefined = undefined
  static _auth: cloudbase.auth.App | undefined = undefined

  static cb(): cloudbase.app.App | undefined {
    if (!this._cb) {
      this._cb = cloudbase.init({
        env: CB_ENV,
        // clientId: 'client_id',
      })
    }
    return this._cb
  }

  static auth(): cloudbase.auth.App | undefined {
    if (!this._auth) {
      this._auth = this.cb()?.auth()
    }
    return this._auth
  }
}
