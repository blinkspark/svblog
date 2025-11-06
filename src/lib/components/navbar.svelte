<script lang="ts">
  import { pb } from '$lib'
  import Icon from '@iconify/svelte'
  import { appState, logout, toggleTheme } from '../../routes/states.svelte'

  let burgerActive = $state(false)
  function toggleBurger() {
    burgerActive = !burgerActive
  }
</script>

<nav class="navbar is-info" aria-label="main navigation">
  <div class="navbar-brand">
    <!-- 品牌 Logo 或名称 -->
    <a class="navbar-item" href="/">
      <Icon icon='material-symbols:robot-2-rounded' width=32 height=32></Icon>
    </a>

    <!-- 汉堡菜单按钮 (移动端显示) -->
    <button
      class="navbar-burger"
      class:is-active={burgerActive}
      onclick={toggleBurger}
      aria-label="menu"
      aria-expanded="false"
      data-target="navbar-menu"
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
  </div>

  <div id="navbar-menu" class="navbar-menu" class:is-active={burgerActive}>
    <!-- 主导航菜单 -->
    <div class="navbar-start">
      <a class="navbar-item" href="/"> 首页 </a>

      <a class="navbar-item">文档</a>

      <!-- 下拉菜单 -->
      <div class="navbar-item has-dropdown is-hoverable">
        <div class="navbar-link">更多</div>

        <div class="navbar-dropdown">
          <a class="navbar-item"> 关于我们 </a>
          <a class="navbar-item"> 工作机会 </a>
          <a class="navbar-item"> 联系我们 </a>
          <hr class="navbar-divider" />
          <a class="navbar-item"> 报告问题 </a>
        </div>
      </div>
    </div>

    <!-- 右侧导航菜单 -->
    <div class="navbar-end">
      <a class="navbar-item" onclick={toggleTheme}
        ><Icon icon={appState.theme === 'dark' ? 'material-symbols:mode-night' : 'material-symbols:sunny'}></Icon></a
      >
      {#if !appState.isLogin}
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-light" href="/login">登录</a>
          </div>
        </div>
      {:else}
        <!-- svelte-ignore a11y_missing_attribute -->
        <div class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-link">{pb.authStore.record?.username}</div>
          <div class="navbar-dropdown">
            <a class="navbar-item" href="/profile">个人中心</a>
            <button class="navbar-item" onclick={logout}>退出登录</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</nav>
