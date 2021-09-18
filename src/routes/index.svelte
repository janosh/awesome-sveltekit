<script lang="ts">
  import GitHubCorner from '../components/GitHubCorner.svelte'
  import Filters from '../components/Filters.svelte'
  import Modal from '../components/Modal.svelte'
  import sites from '../sites'

  const tags = [...new Set(sites.map((site) => site.tags).flat(1))]
  let query = ``
  let activeSite: string | null = null
  let filterTags: string[] = []

  $: filteredSites = sites.filter((site) => {
    return (
      (query?.length === 0 || JSON.stringify(site).includes(query)) &&
      (filterTags.length === 0 || site.tags.some((tag) => filterTags.includes(tag)))
    )
  })

  const prettyDate = (date = ``): string => new Date(date).toISOString().split(`T`)[0]
</script>

<GitHubCorner href="https://github.com/janosh/awesome-svelte-kit" />

<main>
  <img src="/svelte-kit.svg" alt="Logo" width="200px" />
  <h1>Awesome examples of SvelteKit in the wild</h1>

  <Filters {tags} bind:query bind:filterTags />
  <ol>
    {#each filteredSites as { title, url, tags, creator, creatorTwitter, creatorUrl, dateCreated, description } (url)}
      <li>
        <img
          on:click={() => (activeSite = url)}
          src="/screenshots/{title.toLowerCase().replaceAll(` `, `-`)}.png"
          alt="Screenshot of {title}" />
        <a href={url} on:click|stopPropagation>{title}</a><br />
        <small>{tags.join(`, `)}</small>
      </li>
      {#if activeSite === url}
        <Modal on:close={() => (activeSite = null)} style="background: #2c2b35;">
          <div>
            <h1>
              <a href={url}>{title}</a>
            </h1>
            <img
              src="/screenshots/{title.toLowerCase().replaceAll(` `, `-`)}.png"
              alt="" />
            <p>{description}</p>
            <p>
              Creator: {creator}
              {#if creatorUrl}
                &nbsp;&mdash;&nbsp; <a href={creatorUrl}>Web</a>
              {/if}
              {#if creatorTwitter}
                &nbsp;&mdash;&nbsp; <a href="https://twitter.com/@{creatorTwitter}"
                  >Twitter</a>
              {/if}
            </p>
            {#if dateCreated}
              <p>Project started on: {prettyDate(dateCreated)}</p>
            {/if}
            {#if tags?.length > 0}
              <p>Tags: {tags.join(`, `)}</p>
            {/if}
          </div>
        </Modal>
      {/if}
    {/each}
  </ol>
</main>

<style>
  :global(:root) {
    --ghc-color: var(--bg);
    --ghc-bg: white;
  }
  h1 {
    text-align: center;
  }
  ol {
    list-style: none;
    padding: 0;
    display: grid;
    grid-gap: 2em;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
  }
  ol li img {
    cursor: pointer;
  }
  img {
    width: 100%;
  }
</style>
