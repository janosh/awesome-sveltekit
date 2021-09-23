<script lang="ts">
  import GitHubCorner from '../components/GitHubCorner.svelte'
  import Filters from '../components/Filters.svelte'
  import SiteList from '../components/SiteList.svelte'
  import sites from '../sites'

  const tags = [...new Set(sites.map((site) => site.tags).flat(1))]
  let query = ``
  let filterTags: string[] = []

  $: filteredSites = sites.filter((site) => {
    return (
      (query?.length === 0 || JSON.stringify(site).includes(query)) &&
      (filterTags.length === 0 || site.tags.some((tag) => filterTags.includes(tag)))
    )
  })
</script>

<GitHubCorner href="https://github.com/janosh/awesome-svelte-kit" />

<main>
  <img src="/svelte-kit.svg" alt="Logo" width="200px" />
  <h1>Awesome examples of SvelteKit in the wild</h1>

  <Filters {tags} bind:query bind:filterTags />
  <SiteList sites={filteredSites} />
</main>

<style>
  :global(:root) {
    --ghc-color: var(--bg);
    --ghc-bg: white;
  }
  h1 {
    text-align: center;
  }
</style>
