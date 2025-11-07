import { goto } from '$app/navigation'
import { pb, cb, BaseSDK } from '$lib'

export const appState = $state({
  count: 0,
  isLogin: false,
  theme: 'dark',
  username: '',
})

export function refreshIsLogin() {
  let lstate = BaseSDK.auth()?.hasLoginState()
  appState.isLogin = lstate ? true : false
}

export async function logout() {
  await BaseSDK.auth()?.signOut()
  appState.isLogin = false
  goto('/')
}

export function toggleTheme() {
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', appState.theme)
  document.documentElement.setAttribute('data-theme', appState.theme)
}

export async function refreshUsername() {
  const user = await BaseSDK.auth()?.getLoginState()
  user?.user.username && (appState.username = user.user.username)
}
