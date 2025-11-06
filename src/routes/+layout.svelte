<script lang="ts">
  import 'bulma/css/bulma.css'
  import favicon from '$lib/assets/favicon.svg'
  import Navbar from '$lib/components/navbar.svelte'
  import { getCloudBase } from '$lib'
  import { onMount } from 'svelte'

  let { children } = $props()

  onMount(() => {
    getCloudBase()
  })

</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />
{@render children()}
