<script lang="ts">
  import GitHubCorner from 'svelte-github-corner'
  import { repository } from '../../package.json'
  import '../app.css'

  let innerWidth: number
</script>

<svelte:window bind:innerWidth />

<GitHubCorner href={repository} />

<svelte:head>
  <base target="_{innerWidth > 600 ? 'blank' : 'self'}" />
</svelte:head>

<slot />
