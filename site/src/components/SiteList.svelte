<script lang="ts">
  import { flip } from 'svelte/animate'
  import Star from '@svicons/octicons/star.svelte'

  import { Site } from '../types'
  import Modal from './Modal.svelte'
  import Screenshot from './Screenshot.svelte'
  import SiteDetails from './SiteDetails.svelte'

  export let sites: Site[]

  let activeSite: Site | null = null
</script>

<ol>
  {#each sites as site, idx (site.url)}
    <li animate:flip={{ duration: 400 }}>
      <Screenshot title={site.title} on:click={() => (activeSite = site)} />
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
      <p>
        <small>{site.tags.join(`, `)}</small>
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
  ol li {
    cursor: pointer;
  }
</style>
