<script lang="ts">
  import { goto } from '$app/navigation'
  import { repository } from '$site/package.json'
  // oxlint-disable-next-line no-unassigned-import
  import '../app.css'
  import sites from '$root/sites.yml'
  import type { Snippet } from 'svelte'
  import { CommandMenu, GitHubCorner } from 'svelte-widgets'

  let { children }: { children: Snippet<[]> } = $props()
  let inner_width = $state(0)

  const actions = sites.map(({ title, slug }) => ({
    id: slug,
    action: () => goto(slug),
    label: title,
  }))
</script>

<CommandMenu
  {actions}
  placeholder="Go to..."
  recent_actions_key="awesome-sveltekit-cmd"
/>

<svelte:window bind:innerWidth={inner_width} />

<GitHubCorner href={repository} />

<svelte:head>
  <base target="_{inner_width > 600 ? `blank` : `self`}" />
</svelte:head>

{@render children?.()}
