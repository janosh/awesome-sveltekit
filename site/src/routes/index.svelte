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

  function arr_includes(arr: string[], values: string[], mode: 'all' | 'any'): boolean {
    if (arr.length === 0) return false
    if (values.length === 0) return true
    if (mode === `all`) return values.every((val) => arr.includes(val))
    if (mode === `any`) return values.some((val) => arr.includes(val))
    else throw `Unexpected filter mode=${mode}`
  }

  $: filtered_sites = sites.filter((site) => {
    const query_match = $search?.length === 0 || JSON.stringify(site).includes($search)

    const _tags = $filter_tags.map((t) => t.label)
    const _contribs = $filter_contributors.map((c) => c.label)

    const tag_match = arr_includes(site.tags ?? [], _tags, $tag_filter_mode)
    const contrib_match = arr_includes(
      site.contributors?.map((c) => c.name) ?? [],
      _contribs,
      $contributor_filter_mode
    )

    return query_match && tag_match && contrib_match
  })
  $: sorted_sites = filtered_sites // copy array reference

  // arr.sort() sorts in-place but we need to reassign filteredSites so Svelte rerenders
  $: if ($sort_by[0] === `GitHub repo stars`) {
    sorted_sites = filtered_sites.sort(
      (siteA, siteB) => (siteB.repo_stars ?? 0) - (siteA.repo_stars ?? 0)
    )
  } else if ($sort_by[0] === `Date created`) {
    sorted_sites = filtered_sites.sort(
      (siteA, siteB) =>
        +new Date(siteB.date_created ?? 0) - +new Date(siteA.date_created ?? 0)
    )
  } else if ($sort_by[0] === `Date last updated`) {
    sorted_sites = filtered_sites.sort(
      (siteA, siteB) =>
        +new Date(siteB.last_updated ?? 0) - +new Date(siteA.last_updated ?? 0)
    )
  }

  const meta_description = `Awesome examples of SvelteKit sites in the wild`
</script>

<svelte:head>
  <title>Awesome SvelteKit</title>
  <meta name="description" content={meta_description} />
  <meta name="og:description" content={meta_description} />
  <meta name="twitter:creator" content="@jrib_" />
</svelte:head>

<GitHubCorner href="https://github.com/janosh/awesome-sveltekit" />

<main>
  <img src="/sveltekit.svg" alt="Logo" />
  <h1>{sites.length} Awesome Examples of SvelteKit in the Wild</h1>

  <p>
    See something that's missing from this list?
    <a href="https://github.com/janosh/awesome-sveltekit/edit/main/sites.yml">
      PRs welcome!
    </a>
  </p>

  <Filters
    {tags}
    on:toggle-sort={() => (sorted_sites = sorted_sites.reverse())}
    {contributors}
  />

  {#if filtered_sites.length < sites.length}
    <p>
      <span>{filtered_sites.length}</span> match{filtered_sites.length !== 1 ? `es` : ``}
    </p>
  {/if}

  <SiteList sites={sorted_sites} />
</main>

<style>
  h1,
  p {
    text-align: center;
  }
  p span {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0 3pt;
    border-radius: 2pt;
  }
</style>
