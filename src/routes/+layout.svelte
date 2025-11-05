<script lang="ts">
  import 'bulma/css/bulma.css'
  import favicon from '$lib/assets/favicon.svg'
  import { pb } from '$lib'
  import { appState } from './states.svelte'
  import Navbar from '$lib/components/navbar.svelte'
  
  let { children } = $props()

  $effect(() => {
    const unsub = pb.authStore.onChange((auth) => {
      appState.isLogin = pb.authStore.isValid
    })
    appState.isLogin = pb.authStore.isValid
    return unsub
  })
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />
{@render children()}
