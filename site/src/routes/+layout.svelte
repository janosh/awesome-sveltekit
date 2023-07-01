<script lang="ts">
  import { goto } from '$app/navigation'
  import { repository } from '$site/package.json'
  import { CmdPalette } from 'svelte-multiselect'
  import { GitHubCorner } from 'svelte-zoo'
  import '../app.css'
  import sites from '../sites.yml'

  let innerWidth: number

  const actions = sites.map(({ title, slug }) => {
    return { label: title, action: () => goto(slug) }
  })
</script>

<CmdPalette {actions} placeholder="Go to..." />

<svelte:window bind:innerWidth />

<GitHubCorner href={repository} />

<svelte:head>
  <base target="_{innerWidth > 600 ? `blank` : `self`}" />
</svelte:head>

<slot />
