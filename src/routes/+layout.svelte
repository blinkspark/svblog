<script lang="ts">
  import 'bulma/css/bulma.css'
  import favicon from '$lib/assets/favicon.svg'
  import Navbar from '$lib/components/navbar.svelte'
  import { onMount } from 'svelte'
  import { loadTheme } from './states.svelte'

  let { children } = $props()

  onMount(async () => {
    loadTheme()
  })

</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />
{@render children()}
