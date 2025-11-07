<script lang="ts">
  import { goto } from '$app/navigation'
  import { BaseSDK, cb } from '$lib'

  let username = $state('')
  let password = $state('')

  async function login() {
    try {
      await BaseSDK.auth()!.signIn({ username, password })
      goto('/')
    } catch (error) {
      console.error(error)
      alert(error)
    }
  }
</script>

<div class="mt-3 container">
  <div class="form">
    <label for="username">Username</label>
    <input type="text" id="username" bind:value={username} />

    <label for="password">Password</label>
    <input type="password" id="password" bind:value={password} />
    <button class="button is-info" onclick={login}>Test</button>
  </div>
</div>
