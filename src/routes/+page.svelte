<script lang="ts">
  import { BaseSDK, POSTS_PER_PAGE, type BlogPost } from '$lib'
  import { onMount } from 'svelte'
  import { Markdown } from 'svelte-exmarkdown'
  import { appState, refreshLoginState } from './states.svelte'

  let currentPage = $state(1)
  let totalPages = $state(1)
  let posts = $state([]) as Array<BlogPost>

  let isFetchingPage = $state(false)
  let errorMessage = $state('')

  async function fetchPage() {
    if (isFetchingPage) return
    isFetchingPage = true

    try {
      let res = await BaseSDK.cb()?.models.blogs.list({
        getCount: true,
        pageNumber: currentPage,
        pageSize: POSTS_PER_PAGE,
        orderBy: [{ createdAt: 'desc' }],
        filter: {
          where: {
            $or: [{ createBy: { $eq: appState.uid } }, { public: { $eq: true } }],
          },
        },
      })
      totalPages = Math.ceil(res!.data.total! / POSTS_PER_PAGE)
      posts = res!.data.records as Array<BlogPost>
    } catch (error) {
      errorMessage = `加载博客文章时出错: ${error instanceof Error ? error.message : String(error)}`
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

  function getPaginationLinks(): Array<number | '...'> {
    const links: Array<number | '...'> = []
    // 总是显示第一页
    links.push(1)
    // 如果当前页 > 3，添加省略号
    if (currentPage > 3) {
      links.push('...')
    }
    // 添加当前页附近的页
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!links.includes(i)) links.push(i)
    }
    // 如果当前页 < totalPages - 2，添加省略号
    if (currentPage < totalPages - 2) {
      links.push('...')
    }
    // 总是显示最后一页，如果不是第一页
    if (totalPages > 1) {
      links.push(totalPages)
    }
    return links
  }

  onMount(async () => {
    await refreshLoginState()
    await fetchPage()
  })
</script>

<div class="container">
  {#if errorMessage}
    <div class="message is-danger mt-3">
      <div class="message-header">
        <p>错误</p>
        <button class="delete" aria-label="delete" onclick={() => (errorMessage = '')}></button>
      </div>
      <div class="message-body">
        {errorMessage}
      </div>
    </div>
  {/if}
  {#if isFetchingPage}
    <h1 class="title mt-3">Loading...</h1>
  {:else if posts.length === 0 && !errorMessage}
    <div class="card mt-3 p-5 has-text-centered">
      <h2 class="title is-2">暂无博客文章</h2>
      <p class="subtitle mt-3">这里还没有任何内容，请稍后再来查看。</p>
    </div>
  {:else}
    {#each posts as post}
      <div class="card mt-3 p-5">
        <h2 class="title is-2 has-text-centered">{post.title}</h2>
        <hr />
        <div class="content">
          <Markdown md={post.content} />
        </div>
      </div>
    {/each}
  {/if}

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
      {#each getPaginationLinks() as link}
        {#if link === '...'}
          <li><span class="pagination-ellipsis">&hellip;</span></li>
        {:else}
          <li>
            <a class="pagination-link" class:is-current={currentPage === link} onclick={() => toPage(link as number)}
              >{link}</a
            >
          </li>
        {/if}
      {/each}
    </ul>
  </nav>
</div>

<style>
</style>
