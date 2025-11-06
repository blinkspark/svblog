<script lang="ts">
  import { pb } from '$lib'
  import { goto } from '$app/navigation'
  import { refreshIsLogin } from '../states.svelte'

  let username = $state('')
  let password = $state('')
  let passwordConfirm = $state('')
  let isLogin = $state(true)
  let isLoading = $state(false)
  let errorMessage = $state('')

  function handleSubmit(e: Event) {
    e.preventDefault()
    errorMessage = ''

    // 表单验证
    if (!username || !password) {
      errorMessage = '请填写用户名和密码'
      return
    }

    if (!isLogin && password !== passwordConfirm) {
      errorMessage = '两次输入的密码不一致'
      return
    }

    isLoading = true

    if (isLogin) {
      // 登录逻辑
      handleLogin()
    } else {
      // 注册逻辑
      handleRegister()
    }
  }

  async function handleLogin() {
    try {
      await pb.collection('users').authWithPassword(username, password)
      // 登录成功，跳转到首页或其他页面
      refreshIsLogin()
      await goto('/')
    } catch (error) {
      console.error('登录失败:', error)
      errorMessage = '登录失败，请检查用户名和密码'
    } finally {
      isLoading = false
    }
  }

  async function handleRegister() {
    try {
      await pb.collection('users').create({ username, password, passwordConfirm })
      // 注册成功后自动登录
      await pb.collection('users').authWithPassword(username, password)
      refreshIsLogin()
      // 跳转到首页或其他页面
      await goto('/')
    } catch (error) {
      console.error('注册失败:', error)
      errorMessage = '注册失败，请稍后重试'
    } finally {
      isLoading = false
    }
  }

  function toggleMode() {
    isLogin = !isLogin
    passwordConfirm = ''
    errorMessage = ''
  }
</script>

<section class="hero is-fullheight">
  <div class="hero-body">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-4">
          <form class="box" onsubmit={handleSubmit}>
            <div class="field">
              <label class="label" for="username">用户名</label>
              <div class="control">
                <input type="text" class="input" placeholder="用户名" bind:value={username} id="username" />
              </div>
            </div>
            <div class="field">
              <label class="label" for="password">密码</label>
              <div class="control">
                <input type="password" class="input" placeholder="密码" bind:value={password} id="password" />
              </div>
            </div>
            {#if !isLogin}
              <div class="field">
                <label class="label" for="confirmPassword">确认密码</label>
                <div class="control">
                  <input
                    type="password"
                    class="input"
                    placeholder="确认密码"
                    bind:value={passwordConfirm}
                    id="confirmPassword"
                  />
                </div>
              </div>
            {/if}
            {#if errorMessage}
              <div class="notification is-danger">
                {errorMessage}
              </div>
            {/if}
            <div class="field">
              <div class="control">
                <button type="submit" class="button is-primary" disabled={isLoading}>
                  {#if isLoading}
                    <span class="icon">
                      <i class="fas fa-spinner fa-spin"></i>
                    </span>
                  {/if}
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </div>
            </div>
            <div class="field">
              <div class="control has-text-centered">
                <button type="button" class="button is-text" onclick={toggleMode}>
                  {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
