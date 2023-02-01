<script lang="ts">
  import { goto } from '$app/navigation'
  import Icon from '@iconify/svelte'
  import type { Site } from '.'
  import { SitePreview } from '.'

  export let prev: Site
  export let next: Site

  const goto_options = { replaceState: true, noScroll: true }

  function handle_keyup(event: KeyboardEvent) {
    const to = {
      ArrowLeft: prev?.slug,
      ArrowRight: next?.slug,
      Escape: `/`,
    }[event.key]
    if (to) goto(to, goto_options)
  }
</script>

<svelte:window on:keyup={handle_keyup} />

<ul data-sveltekit-noscroll>
  <li>
    <h3>
      <a href={prev.slug}>
        <Icon icon="carbon:previous-filled" inline />
        Previous
      </a>
    </h3>
    <SitePreview site={prev} />
  </li>
  <li style="text-align: right;">
    <h3>
      <a href={next.slug}>
        Next
        <Icon icon="carbon:next-filled" inline />
      </a>
    </h3>
    <SitePreview site={next} />
  </li>
</ul>

<style>
  ul {
    display: flex;
    list-style: none;
    padding: 0;
    place-content: space-between;
    gap: 2em;
    max-width: 1200px;
    margin: 5em auto 0;
  }
  ul li {
    display: flex;
    flex-direction: column;
    max-width: 250px;
  }
</style>
