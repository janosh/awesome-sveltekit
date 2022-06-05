<script lang="ts">
  import GitHubCorner from 'svelte-github-corner'
  import Filters from '../components/Filters.svelte'
  import SiteList from '../components/SiteList.svelte'
  import sites from '../sites.yml'
  import {
    contributor_filter_mode,
    filter_contributors,
    filter_tags,
    search,
    sort_by,
    tag_filter_mode,
  } from '../stores'
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

  const contributors = Object.entries(
    sites
      .flatMap(
        (site) =>
          site.contributors
            ?.map((c) => c.name)
            .filter((name) => ![null, `Janosh Riebesell`].includes(name)) ?? []
      )
      .reduce((acc, el) => {
        acc[el] = (acc[el] ?? 0) + 1
        return acc
      }, {} as Record<string, number>)
  ).sort((c1, c2) => c2[1] - c1[1])

  $: filter_by_query = (site: Site) => {
    return $search?.length === 0 || JSON.stringify(site).includes($search)
  }
  $: filter_by_tags = (site: Site) => {
    const current_tags = $filter_tags.map((t) => t.label)
    if (current_tags.length === 0) return true
    if ($tag_filter_mode === `or`)
      return current_tags.some((tag) => site.tags.includes(tag))
    if ($tag_filter_mode === `and`)
      return current_tags.every((tag) => site.tags.includes(tag))
    console.error(
      `Unexpected state while filtering for current_tags=
      ${JSON.stringify(current_tags)}, filter_mode=${$tag_filter_mode}`
    )
  }
  $: filter_by_contributors = (site: Site) => {
    const current_contributors = $filter_contributors.map((c) => c.label)
    if (current_contributors.length === 0) return true
    if ($contributor_filter_mode === `or`)
      return current_contributors.some((contributor) =>
        site.contributors?.map((c) => c.name).includes(contributor)
      )
    if ($contributor_filter_mode === `and`)
      return current_contributors.every((contributor) =>
        site.contributors?.map((c) => c.name).includes(contributor)
      )
    console.error(
      `Unexpected state while filtering for current_contributors=
      ${JSON.stringify(current_contributors)}, filter_mode=${$contributor_filter_mode}`
    )
  }

  $: filtered_sites = sites.filter((site) => {
    const query_match = filter_by_query(site)
    const tag_match = filter_by_tags(site)
    const contributor_match = filter_by_contributors(site)
    return query_match && tag_match && contributor_match
  })
  $: sorted_sites = filtered_sites // copy array reference

  // arr.sort() sorts in-place but we need to reassign filteredSites so Svelte rerenders
  $: if ($sort_by[0] === `GitHub repo stars`) {
    sorted_sites = filtered_sites.sort(
      (siteA, siteB) => (siteB.repoStars ?? 0) - (siteA.repoStars ?? 0)
    )
  } else if ($sort_by[0] === `Date created`) {
    sorted_sites = filtered_sites.sort(
      (siteA, siteB) =>
        +new Date(siteB.dateCreated ?? 0) - +new Date(siteA.dateCreated ?? 0)
    )
  } else if ($sort_by[0] === `Date last updated`) {
    sorted_sites = filtered_sites.sort(
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

  <Filters
    {tags}
    on:toggle-sort={() => (sorted_sites = sorted_sites.reverse())}
    {contributors}
  />

  {#if filtered_sites.length < sites.length}
    <p>{filtered_sites.length} match{filtered_sites.length !== 1 ? `es` : ``}</p>
  {/if}

  <SiteList sites={sorted_sites} />
</main>

<style>
  h1,
  p {
    text-align: center;
  }
</style>
