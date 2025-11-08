import { goto } from '$app/navigation'
import { getBackendService } from '$lib'

export const appState = $state({
  count: 0,
  isLogin: false,
  theme: 'dark',
  username: '',
  uid: '',
})

export async function refreshLoginState() {
  const backend = getBackendService()
  let lstate = await backend.getLoginState()
  if (!lstate) {
    await backend.signInAnonymously()
    appState.isLogin = false
    return
  }
  if (lstate.user?.username) {
    appState.username = lstate.user.username
    appState.uid = lstate.user.uid
    appState.isLogin = true
  } else {
    appState.isLogin = false
    appState.uid = lstate.user?.uid || ''
    appState.username = ''
  }
}

export async function logout() {
  if (!appState.isLogin) return
  const backend = getBackendService()
  await backend.signOut()
  await backend.signInAnonymously()
  appState.username = ''
  appState.uid = ''
  appState.isLogin = false
  goto('/')
}

export function toggleTheme() {
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark'
  setTheme(appState.theme as 'dark' | 'light')
}

export function setTheme(theme: 'dark' | 'light') {
  appState.theme = theme
  localStorage.setItem('theme', appState.theme)
  document.documentElement.setAttribute('data-theme', appState.theme)
}

export function loadTheme() {
  const theme = localStorage.getItem('theme')
  if (theme) {
    setTheme(theme as 'dark' | 'light')
  }
}
