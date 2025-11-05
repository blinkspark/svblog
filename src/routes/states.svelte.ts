import { pb } from '$lib'

export const appState = $state({
  count: 0,
  isLogin: false,
  theme: 'dark',
})

export function toggleTheme() {
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', appState.theme)
  document.documentElement.setAttribute('data-theme', appState.theme)
}
