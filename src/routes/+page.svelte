<script lang="ts">
  import { pb, POSTS_PER_PAGE } from '$lib'
  import { onMount } from 'svelte'
  import { Markdown } from 'svelte-exmarkdown'

  let currentPage = $state(1)
  let totalPages = $state(1)
  let posts = $state([]) as Array<any>

  let isFetchingPage = $state(false)

  async function fetchPage() {
    if (isFetchingPage) return
    isFetchingPage = true

    try {
      let res = await pb.collection('posts').getList(currentPage, POSTS_PER_PAGE)
      totalPages = res.totalPages
      posts = res.items
    } catch (error) {
    } finally {
      isFetchingPage = false
    }
  }

  onMount(() => {
    fetchPage()
  })
</script>

<div class="container">
  {#if isFetchingPage}
    <h1 class="title mt-3">Loading...</h1>
  {/if}
  {#each posts as post}
    <div class="card mt-3">
      <header class="card-header has-background-primary">
        <p class="card-header-title is-size-3">{post.title}</p>
      </header>
      <div class="content p-5">
        <Markdown md={post.content} />
      </div>
    </div>
  {/each}
</div>

<style>
</style>
