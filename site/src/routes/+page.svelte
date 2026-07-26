<script lang="ts">
  import { replaceState } from '$app/navigation'
  import { page } from '$app/state'
  import { ContributorList, Filters, type Site, SiteList } from '$lib'
  import {
    filters,
    filters_from_query,
    filters_to_query,
    sorted,
  } from '$lib/state.svelte'
  import { repository } from '$site/package.json'
  import sites from '$site/src/sites.yml'
  import Icon from '@iconify/svelte'
  import { onMount } from 'svelte'

  let { data } = $props()

  const count_by = (values: string[]) => {
    const counts: Record<string, number> = {}
    for (const value of values) counts[value] = (counts[value] ?? 0) + 1
    return Object.entries(counts)
  }

  const tags = count_by(sites.flatMap((site) => site.tags))
    .filter(([, count]) => count > 2)
    .toSorted(([tag_a], [tag_b]) => tag_a.localeCompare(tag_b))

  const contributor_names = sites.flatMap((site) =>
    (site.contributors ?? []).map(({ name }) => name),
  )
  const contributors = count_by(
    contributor_names.filter((name) => name && name !== `Janosh Riebesell`),
  ).toSorted((contributor_a, contributor_b) => contributor_b[1] - contributor_a[1])

  // an empty filter matches everything, so no need to special-case empty values
  const arr_includes = (values: string[], required: string[], mode: `all` | `any`) =>
    required.length === 0 ||
    (mode === `all`
      ? required.every((item) => values.includes(item))
      : required.some((item) => values.includes(item)))

  // Restore filter/sort state from the URL on mount and on back/forward nav
  // (which remounts this component). Reading page.url.searchParams is off
  // limits with prerendering enabled, hence location and post-hydration.
  let url_synced = false
  onMount(() => filters_from_query(location.search, { tags, contributors }))
  // Mirror every subsequent change back into the URL. Compare against location,
  // not page.url, which replaceState leaves stale.
  $effect(() => {
    const url = new URL(location.href)
    url.search = filters_to_query(url)
    // The first run only mirrors back the state just restored above. Skipping
    // it also avoids calling replaceState before the router has started.
    if (url_synced && url.href !== location.href) replaceState(url, page.state)
    url_synced = true
  })

  let matching_sites = $derived.by(() => {
    const sort_factor = sorted.order === `desc` ? 1 : -1
    const sort_value = (site: Site) =>
      sorted.by === `stars` ? (site.repo_stars ?? 0) : Date.parse(site.date_created)
    // the selected labels don't vary per site, so resolve them once
    const tag_labels = filters.tags.map(({ label }) => label)
    const contributor_labels = filters.contributors.map(({ label }) => label)

    return sites
      .filter((site) => {
        const query_match =
          filters.search === `` || JSON.stringify(site).includes(filters.search)
        const tag_match = arr_includes(site.tags, tag_labels, filters.tags_mode)
        const contributor_match = arr_includes(
          site.contributors?.map(({ name }) => name) ?? [],
          contributor_labels,
          filters.contributors_mode,
        )
        return query_match && tag_match && contributor_match
      })
      .toSorted(
        (site_a, site_b) => sort_factor * (sort_value(site_b) - sort_value(site_a)),
      )
  })

  const meta_description = `Awesome examples of SvelteKit sites in the wild`
</script>

<svelte:head>
  <title>Awesome SvelteKit</title>
  <meta name="description" content={meta_description} />
  <meta name="og:description" content={meta_description} />
  <meta name="twitter:creator" content="@jrib_" />
</svelte:head>

<main>
  <h1>
    <img
      src="awesome-sveltekit-banner.svg"
      alt="Awesome SvelteKit"
      style="max-height: 120px"
    />
    <br />
    {sites.length} Awesome Examples of SvelteKit in the Wild
  </h1>

  <Filters {tags} {contributors} />

  {#if matching_sites.length < sites.length}
    <p>
      <span>{matching_sites.length}</span> match{matching_sites.length !== 1 ? `es` : ``}
      {#if matching_sites.length === 0}
        (try different filters)
      {/if}
    </p>
  {/if}

  <SiteList sites={matching_sites} />

  <h2>
    🙏 Big thanks to
    <a href="{repository}/graphs/contributors" target="_blank" rel="noreferrer">
      all {data.repo_contributors.length} contributors
    </a>
  </h2>
  <ContributorList contributors={data.repo_contributors} />
</main>

<h2>🎉 Suggestions Welcome</h2>
<p style="max-width: 40em">
  Want to add an <em>open source</em> project to <Icon
    icon="mdi:sunglasses"
    inline
    style="margin: 0 2pt"
  /> this list?
  <a href="{repository}/edit/main/sites.yml">
    <Icon icon="octicon:git-pull-request" inline style="margin: 0 1pt 0 3pt" />
    PRs welcome</a
  >! This collection is meant as a learning resource for Svelte devs. While a site with
  private code can give inspiration, there's little educational value if you can't inspect
  how it was made.
</p>

<p style="max-width: 40em">
  A good place to discover Svelte projects (not necessarily SvelteKit) is
  <a href="https://github.com/trending/svelte?since=monthly">
    <Icon icon="octicon:mark-github" inline style="margin: 0 1pt 0 3pt" />
    GitHub Trending
  </a>. If anything on that list stands out to you but is missing here, please add it!
</p>

<style>
  img {
    max-width: 800px;
    margin: auto;
    display: block;
  }
  :where(:global(h1, h2, p)) {
    text-align: center;
    margin: 1em auto;
  }
  h2 {
    margin: 3em auto 2em;
  }
  p span {
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0 3pt;
    border-radius: 2pt;
  }
</style>
