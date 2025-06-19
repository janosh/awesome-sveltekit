<script lang="ts">
  import { goto } from '$app/navigation'
  import { repository } from '$site/package.json'
  import { CmdPalette, GitHubCorner } from 'svelte-multiselect'
  import '../app.css'
  import sites from '../sites.yml'
  interface Props {
    children?: import('svelte').Snippet
  }

  let { children }: Props = $props()
  let innerWidth: number = $state(0)

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

{@render children?.()}
