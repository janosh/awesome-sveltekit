<script lang="ts">
  import Icon from '@iconify/svelte'
  import { flip } from 'svelte/animate'
  import { fade } from 'svelte/transition'
  import { filter_tags } from '../stores'
  import { type Site } from '../types'
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
      <a href="/{site.slug}" data-sveltekit-prefetch>
        <Screenshot title={site.title} resolution=".small" style="cursor: pointer;" />
      </a>
      <div class="flex">
        <span>
          {idx + 1}. <a href={site.url}>{site.title}</a>
        </span>
        {#if site.repo_stars}
          <small class="flex">
            <Icon icon="octicon:star" />
            &nbsp;{site.repo_stars.toLocaleString()}
          </small>
        {/if}
      </div>
      <p class="tags flex">
        <Icon icon="octicon:tag" style="margin: 0 1ex 0 0;" />
        {#each site.tags as tag}
          <small class:active={$filter_tags.find((t) => t.label === tag)}>
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
