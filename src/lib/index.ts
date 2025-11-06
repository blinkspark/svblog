// place files you want to import through the `$lib` alias in this folder.
import PocketBase from 'pocketbase'

export const POSTS_PER_PAGE = 5
const BASE_URL = import.meta.env.VITE_BASE_URL

export const pb = new PocketBase(BASE_URL)

