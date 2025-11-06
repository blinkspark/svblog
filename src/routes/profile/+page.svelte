<script lang="ts">
  import { pb, POSTS_PER_PAGE } from '$lib'
  import { onMount } from 'svelte'
  import Markdown from 'svelte-exmarkdown'
  import { appState, refreshIsLogin } from '../states.svelte'
  import { goto } from '$app/navigation'

  let tabIndex = $state(0)
  let postsIndex = $state(0)
  let title = $state('')

  let posts: Array<any> = $state([])
  let content = $state('')
  let isPublic = $state(false)

  let currentPage = $state(1)
  let totalPages = $state(1)

  let titleListFetching = $state(false)
  let isCreatingPost = $state(false)
  let isUpdatingPost = $state(false)
  let isDeletingPost = $state(false)

  function setPostsIndex(index: number) {
    postsIndex = index
    title = posts[index].title
    content = posts[index].content
    isPublic = posts[index].public
  }

  async function updatePost() {
    if (isUpdatingPost) return
    isUpdatingPost = true
    const post = posts[postsIndex]
    post.title = title
    post.content = content
    post.public = isPublic
    try {
      await pb.collection('posts').update(post.id, post)
      await refreshTitleList()
    } catch (error) {
      console.error('Error updating blog:', error)
    } finally {
      isUpdatingPost = false
    }
  }

  async function deletePost() {
    if (isDeletingPost || posts.length === 0) return
    isDeletingPost = true

    // 添加确认对话框
    if (!confirm(`确定要删除文章 "${posts[postsIndex].title}" 吗？此操作不可撤销。`)) {
      isDeletingPost = false
      return
    }

    try {
      await pb.collection('posts').delete(posts[postsIndex].id)
      console.log('Deleted post:', posts[postsIndex].title)

      // 重置表单状态
      title = ''
      content = ''
      isPublic = false

      // 如果删除的是当前页面的最后一篇文章，需要回到上一页
      if (posts.length === 1 && currentPage > 1) {
        currentPage -= 1
      }

      await refreshTitleList()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('删除文章失败，请重试')
    } finally {
      isDeletingPost = false
    }
  }

  async function refreshTitleList() {
    if (titleListFetching) return
    titleListFetching = true
    try {
      //{ fields: 'id,title,created,updated' }
      const records = await pb
        .collection('posts')
        .getList(currentPage, POSTS_PER_PAGE, { fields: 'id,title,content,public' })
      totalPages = records.totalPages
      posts.length = 0
      posts.push(...records.items)
      console.log('Fetched blogs:', posts)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      titleListFetching = false
    }
  }

  async function createPost() {
    if (isCreatingPost) return
    isCreatingPost = true
    const post = {
      title: '新建文章',
      public: false,
    }

    try {
      const record = await pb.collection('posts').create(post)
      console.log('Created blog:', record)
      await refreshTitleList()
    } catch (error) {
      console.error('Error creating blog:', error)
    } finally {
      isCreatingPost = false
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
    await refreshTitleList()
  }

  onMount(async () => {
    refreshIsLogin()
    if (!appState.isLogin) {
      goto('/login')
    }
    await refreshTitleList()
  })
</script>

<div class="container pt-5">
  <h2 class="title is-2">{pb.authStore.record?.username}</h2>
  <section class="tabs">
    <ul>
      <li class:is-active={tabIndex === 0}><a onclick={() => (tabIndex = 0)}>博客编辑器</a></li>
      <li class:is-active={tabIndex === 1}><a onclick={() => (tabIndex = 1)}>个人信息</a></li>
      <li class:is-active={tabIndex === 2}><a onclick={() => (tabIndex = 2)}>账户设置</a></li>
      <li class:is-active={tabIndex === 3}><a onclick={() => (tabIndex = 3)}>安全性</a></li>
    </ul>
  </section>
  {#if tabIndex === 0}
    <div>
      <div class="columns">
        <div class="column is-3">
          <aside class="menu">
            <ul class="menu-list">
              <li>
                <a class="is-active has-text-centered" onclick={createPost}>
                  {#if isCreatingPost}
                    创建中...
                  {:else}
                    新建 +
                  {/if}
                </a>
              </li>
            </ul>
            <ul class="menu-list">
              {#if titleListFetching}
                <li class="has-text-centered">加载中...</li>
              {:else}
                {#each posts as post, i}
                  <li><a onclick={() => setPostsIndex(i)}>{post.title}</a></li>
                {/each}
              {/if}
            </ul>
            {#if totalPages > 1}
              <nav class="pagination is-centered is-small">
                <a
                  class="pagination-previous"
                  class:is-disabled={!hasPrevPage()}
                  onclick={() => (hasPrevPage() ? toPage(currentPage - 1) : '')}>Pre</a
                >
                <ul class="pagination-list">
                  <li>
                    <a class="pagination-link" class:is-current={currentPage === 1} onclick={() => toPage(1)}>1</a>
                  </li>
                  {#if totalPages == 3}
                    <li>
                      <a class="pagination-link" class:is-current={currentPage === 2} onclick={() => toPage(2)}>2</a>
                    </li>
                  {/if}
                  {#if totalPages > 3}
                    {#if currentPage > 3}
                      <li><a class="pagination-ellipsis">&hellip;</a></li>
                    {/if}
                    <li><a class="pagination-link" onclick={() => toPage(currentPage - 1)}>{currentPage - 1}</a></li>
                    <li><a class="pagination-link is-current">{currentPage}</a></li>
                    <li><a class="pagination-link" onclick={() => toPage(currentPage + 1)}>{currentPage + 1}</a></li>
                    {#if currentPage < totalPages - 2}
                      <li><a class="pagination-ellipsis">&hellip;</a></li>
                    {/if}
                  {/if}

                  {#if totalPages > 1}
                    <li><a class="pagination-link">{totalPages}</a></li>
                  {/if}
                </ul>
                <a
                  class="pagination-next"
                  class:is-disabled={!hasNextPage()}
                  onclick={() => (hasNextPage() ? toPage(currentPage + 1) : '')}>Next</a
                >
              </nav>
            {/if}
          </aside>
        </div>
        <div class="column is-4">
          <label class="label" for="title">标题</label>
          <div class="control">
            <input type="text" bind:value={title} class="input" id="title" />
          </div>
          <label class="label mt-2" for="content">内容</label>
          <div class="control">
            <textarea bind:value={content} class="textarea" rows="10" id="content"></textarea>
          </div>
          <div class="control mt-2">
            <label class="checkbox">
              <input type="checkbox" bind:checked={isPublic} />
              公开
            </label>
          </div>
          <div class="columns mt-2 pl-3 pr-3">
            <button class="button is-primary column" onclick={updatePost}>
              {#if isUpdatingPost}
                保存中...
              {:else}
                保存
              {/if}
            </button>
            <button class="button is-danger column ml-3" onclick={deletePost}>
              {#if isDeletingPost}
                删除中...
              {:else}
                删除
              {/if}
            </button>
          </div>
        </div>
        <div class="column is-5">
          <div class="content">
            <Markdown md={content} />
          </div>
        </div>
      </div>
    </div>
  {:else if tabIndex === 1}
    <div>
      <h3 class="title is-3">个人信息</h3>
      <p>这里是个人信息的内容。</p>
    </div>
  {:else if tabIndex === 2}
    <div>
      <h3 class="title is-3">账户设置</h3>
      <p>这里是账户设置的内容。</p>
    </div>
  {:else if tabIndex === 3}
    <div>
      <h3 class="title is-3">安全性</h3>
      <p>这里是安全性的内容。</p>
    </div>
  {/if}
</div>

<style>
</style>
