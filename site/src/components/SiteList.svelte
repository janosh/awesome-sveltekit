<script lang="ts">
  import Star from '@svicons/octicons/star-fill.svelte'
  import Tag from '@svicons/octicons/tag.svelte'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { filterTags } from '../stores'
  import { Site } from '../types'
  import Screenshot from './Screenshot.svelte'

  export let sites: Site[]
</script>

<ol>
  {#each sites as site, idx (site.url)}
    <li
      animate:flip={{ duration: 400 }}
      in:fade|local={{ delay: 100 }}
      out:fade|local={{ delay: 100 }}
    >
      <a href="/{site.slug}" sveltekit:prefetch>
        <Screenshot title={site.title} resolution=".small" style="cursor: pointer;" />
      </a>
      <div class="flex">
        <span>
          {idx + 1}. <a href={site.url}>{site.title}</a>
        </span>
        {#if site.repoStars}
          <small class="flex"><Star width="1em" />&nbsp;{site.repoStars}</small>
        {/if}
      </div>
      <p class="tags flex">
        <Tag width="1em" height="1.2em" style="margin-right: 1ex;" />
        {#each site.tags as tag}
          <small class:active={$filterTags.find((t) => t.label === tag)}>
            {tag}
          </small>
        {/each}
      </p>
    </li>
  {/each}
</ol>

<style>
  ol {
    list-style: none;
    padding: 0;
    display: grid;
    grid-gap: 2em;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
  }
  div.flex {
    margin-top: 6pt;
    justify-content: space-between;
  }
  p.tags small {
    background-color: rgba(255, 255, 255, 0.2);
    line-height: 1.2em;
    padding: 1pt 3pt;
    margin: 3pt 0;
    border-radius: 3pt;
  }
  p.tags small:not(:last-child) {
    margin-right: 1ex;
  }
  p.tags small.active {
    font-weight: bold;
  }
</style>
