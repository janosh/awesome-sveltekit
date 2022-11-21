<script lang="ts">
  import '../app.css'
  import { name, repository } from '../../package.json'
  import GitHubCorner from 'svelte-github-corner'

  let innerWidth: number
</script>

<svelte:window bind:innerWidth />

<GitHubCorner href={repository} />

<svelte:head>
  <base
    href={import.meta.env.CI ? `/${name}/` : ``}
    target="_{innerWidth > 600 ? 'blank' : 'self'}"
  />
</svelte:head>

<slot />
