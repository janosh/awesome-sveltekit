<script lang="ts">
  import GitHubCorner from 'svelte-github-corner'
  import Filters from '../components/Filters.svelte'
  import SiteList from '../components/SiteList.svelte'
  import sites from '../sites.yml'
  import { filterTags, search, sortBy, tagFilterMode } from '../stores'
  import { Site } from '../types'

  const tags = Object.entries(
    sites
      .flatMap((site) => site.tags)
      .reduce((acc, el) => {
        acc[el] = (acc[el] ?? 0) + 1
        return acc
      }, {} as Record<string, number>)
  ).filter(([, count]) => count > 2)
  tags.sort(([a], [b]) => a.localeCompare(b))

  $: filterByQuery = (site: Site) => {
    return $search?.length === 0 || JSON.stringify(site).includes($search)
  }
  $: filterByTags = (site: Site, filterTags: string[], filterMode: `and` | `or`) => {
    if (filterTags.length === 0) return true
    if (filterMode === `or`) return filterTags.some((tag) => site.tags.includes(tag))
    if (filterMode === `and`) return filterTags.every((tag) => site.tags.includes(tag))
    console.error(
      `Unexpected state during tag filtering: filterTags=
      ${JSON.stringify(filterTags)}, filterMode=${filterMode}`
    )
  }

  $: filteredSites = sites.filter(
    (site) =>
      filterByQuery(site) &&
      filterByTags(
        site,
        $filterTags.map((t) => t.label),
        $tagFilterMode
      )
  )
  $: sortedSites = filteredSites // copy array reference

  // arr.sort() sorts in-place but we need to reassign filteredSites so Svelte rerenders
  $: if ($sortBy[0] === `GitHub repo stars`) {
    sortedSites = filteredSites.sort(
      (siteA, siteB) => (siteB.repoStars ?? 0) - (siteA.repoStars ?? 0)
    )
  } else if ($sortBy[0] === `Date created`) {
    sortedSites = filteredSites.sort(
      (siteA, siteB) =>
        +new Date(siteB.dateCreated ?? 0) - +new Date(siteA.dateCreated ?? 0)
    )
  } else if ($sortBy[0] === `Date last updated`) {
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

  <p>
    Do you have something to add to this list?
    <a href="https://github.com/janosh/awesome-svelte-kit#-open-to-suggestions">
      We're open to suggestions.
    </a>
  </p>

  <Filters {tags} on:toggle-sort={() => (sortedSites = sortedSites.reverse())} />

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
