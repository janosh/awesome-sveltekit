<script lang="ts">
  import { goto } from '$app/navigation'
  import { filters } from '$lib/state.svelte'
  import { highlight_matches } from 'svelte-multiselect/attachments'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import type { Site } from './index'
  import { SitePreview } from './index'

  interface Props {
    sites: Site[]
  }
  let { sites }: Props = $props()

  let active_idx = $state(-1)

  function handle_keyup(event: KeyboardEvent) {
    if (event.key === `Enter` && active_idx >= 0) {
      const site = sites[active_idx]
      goto(site.slug)
    }
    const to = {
      // wrap around
      ArrowLeft: (active_idx - 1 + sites.length) % sites.length,
      ArrowRight: (active_idx + 1) % sites.length,
      Escape: -1,
    }[event.key]
    if (to !== undefined && to >= 0) active_idx = to
    // keep active_idx in viewport
    const active = document.querySelector(`ol > li.active`)
    if (active) active.scrollIntoViewIfNeeded()
  }
</script>

<svelte:window onkeyup={handle_keyup} />

<ol {@attach highlight_matches({ query: filters.search, css_class: `highlight-match` })}>
  {#each sites as site, idx (site.url)}
    <li
      animate:flip={{ duration: 400 }}
      in:fade={{ delay: 100 }}
      out:fade={{ delay: 100 }}
      class:active={idx === active_idx}
    >
      <SitePreview {site} idx={idx + 1} tags />
    </li>
  {/each}
</ol>

<style>
  ol {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
  }
  ol li {
    transition: 0.3s;
    border-radius: 1ex;
    padding: 10pt;
  }
  ol > :is(:global(li:hover, li.active)) {
    transform: scale(1.01);
    background-color: rgba(255, 255, 255, 0.05);
  }
</style>
