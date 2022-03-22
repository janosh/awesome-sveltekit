<script lang="ts">
  import GitHubCorner from 'svelte-github-corner'
  import Filters from '../components/Filters.svelte'
  import SiteList from '../components/SiteList.svelte'
  import sites from '../sites.yml'
  import { filterTags, sortBy, tagFilterMode } from '../stores'
  import { Site } from '../types'

  const tags = [...new Set(sites.flatMap((site) => site.tags))]
  $: tags.sort((a, b) => a.localeCompare(b))
  let query = ``

  $: filterByQuery = (site: Site) => {
    return query?.length === 0 || JSON.stringify(site).includes(query)
  }
  $: filterByTags = (site: Site, filterTags: string[], filterMode: `AND` | `OR`) => {
    if (filterTags.length === 0) return true
    if (filterMode === `OR`) return filterTags.some((tag) => site.tags.includes(tag))
    if (filterMode === `AND`) return filterTags.every((tag) => site.tags.includes(tag))
    console.error(
      `Unexpected state during tag filtering: filterTags=
      ${JSON.stringify(filterTags)}, filterMode=${filterMode}`
    )
  }

  $: filteredSites = sites.filter(
    (site) => filterByQuery(site) && filterByTags(site, $filterTags, $tagFilterMode)
  )
  $: sortedSites = filteredSites // copy array reference

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
  <img src="/svelte-kit.svg" alt="Logo" />
  <h1>{sites.length} Awesome Examples of SvelteKit in the Wild</h1>

  <Filters
    {tags}
    bind:query
    on:toggleSort={() => (sortedSites = sortedSites.reverse())}
  />

  {#if filteredSites.length < sites.length}
    <p>{filteredSites.length} match{filteredSites.length !== 1 ? `es` : ``}</p>
  {/if}

  <SiteList sites={sortedSites} />
</main>

<style>
  h1,
  p {
    text-align: center;
  }
</style>
