<script lang="ts">
  import { goto } from '$app/navigation'
  import { repository } from '$site/package.json'
  // oxlint-disable-next-line no-unassigned-import
  import '../app.css'
  import sites from '$site/src/sites.yml'
  import type { Snippet } from 'svelte'
  import { CmdPalette, GitHubCorner } from 'svelte-multiselect'

  let { children }: { children: Snippet<[]> } = $props()
  let innerWidth: number = $state(0)

  const actions = sites.map(({ title, slug }) => ({ action: () => goto(slug), label: title }))
</script>

<CmdPalette {actions} placeholder="Go to..." />

<svelte:window bind:innerWidth />

<GitHubCorner href={repository} />

<svelte:head>
  <base target="_{innerWidth > 600 ? `blank` : `self`}" />
</svelte:head>

{@render children?.()}
