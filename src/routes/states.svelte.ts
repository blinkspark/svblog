import { goto } from '$app/navigation'
import { BaseSDK } from '$lib'

export const appState = $state({
  count: 0,
  isLogin: false,
  theme: 'dark',
  username: '',
  uid: '',
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
    appState.uid = lstate.user.uid!
    appState.isLogin = true
  }else{
    appState.isLogin = false
    appState.uid = lstate.user.uid!
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
