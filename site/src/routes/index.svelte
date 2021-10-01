<script lang="ts">
  import GitHubCorner from '../components/GitHubCorner.svelte'
  import Filters from '../components/Filters.svelte'
  import SiteList from '../components/SiteList.svelte'
  import sites from '../sites'
  import { filterTags, sortBy } from '../stores'

  const tags = [...new Set(sites.map((site) => site.tags).flat(1))]
  let query = ``

  $: filteredSites = sites.filter(
    (site) =>
      (query?.length === 0 || JSON.stringify(site).includes(query)) &&
      ($filterTags.length === 0 || site.tags.some((tag) => $filterTags.includes(tag)))
  )
  let sortedSites = sites

  // arr.sort() sorts in-place but we need to reassign filteredSites so Svelte rerenders
  $: if ($sortBy === `GitHub repo stars`) {
    sortedSites = filteredSites.sort(
      (siteA, siteB) => (siteB.repoStars ?? 0) - (siteA.repoStars ?? 0)
    )
  } else if ($sortBy === `Date created`) {
    sortedSites = filteredSites.sort(
      (siteA, siteB) =>
        +new Date(siteB.dateCreated ?? 0) - +new Date(siteA.dateCreated ?? 0)
    )
  } else if ($sortBy === `Date last updated`) {
    sortedSites = filteredSites.sort(
      (siteA, siteB) =>
        +new Date(siteB.lastUpdated ?? 0) - +new Date(siteA.lastUpdated ?? 0)
    )
  }
</script>

<GitHubCorner href="https://github.com/janosh/awesome-svelte-kit" />

<main>
  <img src="/svelte-kit.svg" alt="Logo" width="200px" />
  <h1>Awesome examples of SvelteKit in the wild</h1>

  <Filters
    {tags}
    bind:query
    on:toggleSort={() => (sortedSites = sortedSites.reverse())} />
  <SiteList sites={sortedSites} />
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
