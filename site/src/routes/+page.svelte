<script lang="ts">
  import { ContributorList, Filters, SiteList } from '$lib'
  import {
    contributor_filter_mode,
    filter_contributors,
    filter_tags,
    search,
    sorted_sites,
    sort_by,
    tag_filter_mode,
  } from '$lib/stores'
  import { repository } from '$site/package.json'
  import Icon from '@iconify/svelte'
  import sites from '../sites.yml'
  import type { PageData } from './$types'

  export let data: PageData

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
    if (values.length === 0) return true
    if (arr.length === 0) return false
    if (mode === `all`) return values.every((val) => arr.includes(val))
    if (mode === `any`) return values.some((val) => arr.includes(val))
    else throw `Unexpected filter mode=${mode}`
  }

  $: filtered_sites = sites.filter((site) => {
    const query_match = $search?.length === 0 || JSON.stringify(site).includes($search)

    const tag_match = arr_includes(
      site.tags ?? [],
      $filter_tags.map((t) => t.label), // tags the site should have
      $tag_filter_mode // all or any
    )
    const contrib_match = arr_includes(
      site.contributors?.map((c) => c.name) ?? [],
      $filter_contributors.map((c) => c.label), // contributors the site should have
      $contributor_filter_mode // all or any
    )

    return query_match && tag_match && contrib_match
  })

  // arr.sort() sorts in-place but we need to reassign filtered_sites so Svelte rerenders
  $: if ($sort_by[0] === `GitHub repo stars`) {
    $sorted_sites = filtered_sites.sort(
      (siteA, siteB) => (siteB.repo_stars ?? 0) - (siteA.repo_stars ?? 0)
    )
  } else if ($sort_by[0] === `Date created`) {
    $sorted_sites = filtered_sites.sort(
      (siteA, siteB) => +new Date(siteB.date_created) - +new Date(siteA.date_created)
    )
  } else if ($sort_by[0] === `Date last updated`) {
    $sorted_sites = filtered_sites.sort(
      (siteA, siteB) => +new Date(siteB.last_updated) - +new Date(siteA.last_updated)
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

<main>
  <h1>
    <img
      src="awesome-sveltekit-banner.svg"
      alt="Awesome SvelteKit"
      style="max-height: 120px;"
    />
    <br />
    {sites.length} Awesome Examples of SvelteKit in the Wild
  </h1>

  <Filters
    {tags}
    on:toggle-sort={() => ($sorted_sites = $sorted_sites.reverse())}
    {contributors}
  />

  {#if $sorted_sites.length < sites.length}
    <p>
      <span>{$sorted_sites.length}</span> match{$sorted_sites.length !== 1 ? `es` : ``}
      {#if $sorted_sites?.length === 0}
        (try different filters)
      {/if}
    </p>
  {/if}

  <SiteList sites={$sorted_sites} />

  <h2>🎉 Open to Suggestions</h2>
  <p style="max-width: 40em;">
    Want to add an <em>open source</em> project to <Icon
      icon="mdi:sunglasses"
      inline
      style="margin: 0 2pt;"
    /> this list?
    <a href="{repository}/edit/main/sites.yml">
      <Icon icon="octicon:git-pull-request" inline style="margin: 0 1pt 0 3pt;" />
      PRs welcome</a
    >! This collection is meant as a learning resource for Svelte devs. While a site with
    private code can give inspiration, there's little educational value if you can't
    inspect how it was made.
  </p>

  <p style="max-width: 40em;">
    A good place to discover Svelte projects (not necessarily SvelteKit) is
    <a href="https://github.com/trending/svelte?since=monthly">
      <Icon icon="octicon:mark-github" inline style="margin: 0 1pt 0 3pt;" />
      GitHub Trending
    </a>. If anything on that list stands out to you but is missing here, please add it!
  </p>

  <h2>
    🙏 Big thanks to
    <a href="{repository}/graphs/contributors" target="_blank" rel="noreferrer">
      all {data.repo_contributors.length} contributors
    </a>
  </h2>
  <ContributorList contributors={data.repo_contributors} />
</main>

<style>
  img {
    max-width: 800px;
    margin: auto;
    display: block;
  }
  :where(h1, h2, p) {
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
