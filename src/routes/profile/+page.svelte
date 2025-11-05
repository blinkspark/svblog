<script lang="ts">
  import { BLOGS_PER_PAGE, pb } from '$lib'
  import { onMount } from 'svelte'
  import Markdown from 'svelte-exmarkdown'

  let tabIndex = $state(0)
  let postsIndex = $state(0)
  let title = $state('')

  let posts: Array<any> = $state([])
  let content = $state('')
  let isPublic = $state(false)

  function setPostsIndex(index: number) {
    postsIndex = index
    title = posts[index].title
    content = posts[index].content
    isPublic = posts[index].public
  }

  async function updatePost() {
    const post = posts[postsIndex]
    post.title = title
    post.content = content
    post.public = isPublic
    await pb.collection('posts').update(post.id, post)
  }

  async function refreshPosts() {
    try {
      //{ fields: 'id,title,created,updated' }
      const records = await pb.collection('posts').getFullList({ fields: 'id,title,content,public' })
      posts.length = 0
      posts.push(...records)
      console.log('Fetched blogs:', posts)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  }

  onMount(async () => {
    await refreshPosts()
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
        <div class="column is-2">
          <aside class="menu">
            <ul class="menu-list">
              <li><a class="is-active center">新建 +</a></li>
            </ul>
            <ul class="menu-list">
              {#each posts as blog, i}
                <li><a class="center" onclick={() => setPostsIndex(i)}>{blog.title}</a></li>
              {/each}
            </ul>
          </aside>
        </div>
        <div class="column is-5">
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
            <button class="button is-primary column" onclick={updatePost}>保存</button>
            <button class="button is-danger column ml-3" onclick={updatePost}>删除</button>
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
  .center {
    text-align: center;
  }
</style>
