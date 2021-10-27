<script lang="ts">
  import { flip } from 'svelte/animate'
  import Star from '@svicons/octicons/star.svelte'

  import { Site } from '../types'
  import Modal from './Modal.svelte'
  import Screenshot from './Screenshot.svelte'
  import SiteDetails from './SiteDetails.svelte'
  import Tag from '@svicons/octicons/tag.svelte'

  import { filterTags } from '../stores'

  const appendTagToFilters = (tag: string) => () => {
    if (!$filterTags.includes(tag)) {
      $filterTags = [tag, ...$filterTags]
    }
  }

  export let sites: Site[]

  let activeSite: Site | null = null
</script>

<ol>
  {#each sites as site, idx (site.url)}
    <li animate:flip={{ duration: 400 }}>
      <Screenshot
        title={site.title}
        on:click={() => (activeSite = site)}
        style="cursor: pointer;" />
      <div class="flex" style="justify-content: space-between;">
        <span>
          {idx + 1}.
          <!-- stopPropagation to prevent opening modal -->
          <a href={site.url} on:click|stopPropagation>{site.title}</a>
        </span>
        {#if site.repoStars}
          <small class="flex"><Star width="1em" />&nbsp;{site.repoStars}</small>
        {/if}
      </div>
      <p class="tags flex">
        <Tag width="1em" height="1.2em" style="margin-right: 1ex;" />
        {#each site.tags as tag, idx}
          {#if idx > 0},&thinsp;{/if}
          <small
            class:active={$filterTags.includes(tag)}
            title={$filterTags.includes(tag)
              ? `Already selected`
              : `Filter list of sites to include tag '${tag}'`}
            on:click={appendTagToFilters(tag)}>{tag}</small>
        {/each}
      </p>
    </li>
  {/each}
  {#if activeSite}
    <Modal on:close={() => (activeSite = null)} style="background: #2c2b35;">
      <SiteDetails site={activeSite} />
    </Modal>
  {/if}
</ol>

<style>
  ol {
    list-style: none;
    padding: 0;
    display: grid;
    grid-gap: 2em;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
  }
  p.tags small:not(.active):hover {
    cursor: pointer;
    text-decoration: underline;
  }
</style>
