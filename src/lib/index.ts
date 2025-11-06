// place files you want to import through the `$lib` alias in this folder.
import cloudbase from '@cloudbase/js-sdk'
import PocketBase from 'pocketbase'

export const POSTS_PER_PAGE = 5
const BASE_URL = import.meta.env.VITE_BASE_URL

export const pb = new PocketBase(BASE_URL)

export const CB_ENV = import.meta.env.VITE_CB_ENV

export let cb: cloudbase.app.App | null = null
export function getCloudBase(): cloudbase.app.App | null {
  if (!cb) {
    cb = cloudbase.init({
      env: CB_ENV,
      // clientId: 'client_id',
    })
  }
  return cb
}
