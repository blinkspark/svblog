<script lang="ts">
  import { BaseSDK, pb, POSTS_PER_PAGE } from '$lib'
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
      let res = await BaseSDK.cb()?.models.blogs.list({
        getCount: true,
        pageNumber: currentPage,
        pageSize: POSTS_PER_PAGE,
      })
      totalPages = Math.ceil(res!.data.total! / POSTS_PER_PAGE)
      posts = res!.data.records
    } catch (error) {
    } finally {
      isFetchingPage = false
    }
  }

  function hasNextPage() {
    return currentPage < totalPages
  }

  function hasPrevPage() {
    return currentPage > 1
  }

  async function toPage(page: number) {
    if (page < 1 || page > totalPages || page === currentPage) return
    currentPage = page
    await fetchPage()
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
    <div class="card mt-3 p-5">
      <h2 class="title is-2 has-text-centered">{post.title}</h2>
      <hr />
      <div class="content">
        <Markdown md={post.content} />
      </div>
    </div>
  {/each}

  <!-- 分页组件 -->

  <nav class="pagination is-centered mt-5" aria-label="pagination">
    <a
      class="pagination-previous"
      class:is-disabled={!hasPrevPage()}
      onclick={() => (hasPrevPage() ? toPage(currentPage - 1) : null)}>上一页</a
    >
    <a
      class="pagination-next"
      class:is-disabled={!hasNextPage()}
      onclick={() => (hasNextPage() ? toPage(currentPage + 1) : null)}>下一页</a
    >
    <ul class="pagination-list">
      <li><a class="pagination-link" class:is-current={currentPage === 1} onclick={() => toPage(1)}>1</a></li>
      {#if totalPages == 3}
        <li>
          <a class="pagination-link" class:is-current={currentPage === 2} onclick={() => toPage(2)}>2</a>
        </li>
      {/if}
      {#if totalPages > 3}
        {#if currentPage > 3}
          <li><span class="pagination-ellipsis">&hellip;</span></li>
        {/if}
        <li><a class="pagination-link" onclick={() => toPage(currentPage - 1)}>{currentPage - 1}</a></li>
        <li><a class="pagination-link is-current">{currentPage}</a></li>
        <li><a class="pagination-link" onclick={() => toPage(currentPage + 1)}>{currentPage + 1}</a></li>
        {#if currentPage < totalPages - 2}
          <li><span class="pagination-ellipsis">&hellip;</span></li>
        {/if}
      {/if}

      {#if totalPages > 1}
        <li>
          <a class="pagination-link" class:is-current={currentPage === totalPages} onclick={() => toPage(totalPages)}
            >{totalPages}</a
          >
        </li>
      {/if}
    </ul>
  </nav>
</div>

<style>
</style>
