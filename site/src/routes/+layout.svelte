<script lang="ts">
  import { repository } from '$site/package.json'
  import { GitHubCorner } from 'svelte-zoo'
  import '../app.css'

  let innerWidth: number
</script>

<svelte:window bind:innerWidth />

<GitHubCorner href={repository} />

<svelte:head>
  <base target="_{innerWidth > 600 ? 'blank' : 'self'}" />
</svelte:head>

<slot />
