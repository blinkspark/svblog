<script lang="ts">
  import 'bulma/css/bulma.css'
  import favicon from '$lib/assets/favicon.svg'
  import Navbar from '$lib/components/navbar.svelte'
  import { getCloudBase } from '$lib'
  import { onMount } from 'svelte'

  let { children } = $props()

  onMount(async () => {
    try {
      const app = getCloudBase()
      console.log('CloudBase initialized:', app)
    } catch (error) {
      console.error('Failed to initialize CloudBase:', error)
    }
  })

</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />
{@render children()}
