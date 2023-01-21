<script lang="ts">
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { SitePreview } from '.'
  import type { Site } from './types'

  export let sites: Site[]
</script>

<ol>
  {#each sites as site, idx (site.url)}
    <li
      animate:flip={{ duration: 400 }}
      in:fade|local={{ delay: 100 }}
      out:fade|local={{ delay: 100 }}
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
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
  }
  ol li {
    transition: 0.3s;
    border-radius: 1ex;
    padding: 10pt;
  }
  ol li:hover {
    transform: scale(1.01);
    background-color: rgba(255, 255, 255, 0.05);
  }
</style>
