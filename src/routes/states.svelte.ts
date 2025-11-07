import { goto } from '$app/navigation'
import { BaseSDK } from '$lib'

export const appState = $state({
  count: 0,
  isLogin: false,
  theme: 'dark',
  username: '',
})

export async function refreshLoginState() {
  let lstate = await BaseSDK.auth()?.getLoginState()
  if (!lstate) {
    await BaseSDK.auth()?.signInAnonymously()
    appState.isLogin = false
    return
  }
  if (lstate.user.username) {
    appState.username = lstate.user.username
    appState.isLogin = true
  }else{
    appState.isLogin = false
    appState.username = ''
  }
}

export async function logout() {
  if (!appState.isLogin) return
  await BaseSDK.auth()?.signOut()
  await BaseSDK.auth()?.signInAnonymously()
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
