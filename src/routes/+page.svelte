<script lang="ts">
  import { pb } from '$lib'
  import { onMount } from 'svelte'
  let isLoggedIn = $state(false)
  $effect(() => {
    const unsub = pb.authStore.onChange((auth) => {
      isLoggedIn = pb.authStore.isValid
    })
    isLoggedIn = pb.authStore.isValid
    return unsub
  })
  onMount(() => {
    let theme = localStorage.getItem('theme')
    if (!theme) {
      localStorage.setItem('theme', 'dark')
      theme = 'dark'
    }
    document.documentElement.setAttribute('data-theme', theme)
  })
</script>

