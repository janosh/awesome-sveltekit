<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { filters } from './state.svelte.ts'
  import { highlight_matches } from 'svelte-widgets/attachments'
  import { is_editable_event_target } from 'svelte-widgets/utils'
  import { flip } from 'svelte/animate'
  import type { HTMLAttributes } from 'svelte/elements'
  import { fade } from 'svelte/transition'
  import type { Site } from './index.ts'
  import SitePreview from './SitePreview.svelte'

  let { sites, ...rest }: { sites: Site[] } & HTMLAttributes<HTMLOListElement> = $props()
  let active_idx = $state(-1)

  function handle_keyup(event: KeyboardEvent) {
    if (sites.length === 0 || is_editable_event_target(event.target)) return
    if (event.key === `Escape`) active_idx = -1
    if (event.key === `Enter` && active_idx >= 0) {
      goto(resolve(`/[slug]`, { slug: sites[active_idx].slug }))
    }
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key]
    // from no highlight (-1), → starts at the first card and ← at the last
    const from = active_idx < 0 && step === -1 ? 0 : active_idx
    if (step !== undefined) active_idx = (from + step + sites.length) % sites.length
    // scrollIntoViewIfNeeded is non-standard (WebKit/Blink only), missing from lib.dom
    const active = document.querySelector<
      Element & { scrollIntoViewIfNeeded?: () => void }
    >(`ol > li.active`)
    active?.scrollIntoViewIfNeeded?.()
  }
</script>

<svelte:window onkeyup={handle_keyup} />

<ol
  {@attach highlight_matches({ query: filters.search, css_class: `highlight-match` })}
  {...rest}
>
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
