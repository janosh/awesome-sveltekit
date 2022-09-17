<script lang="ts">
  import Filters from '$lib/Filters.svelte'
  import SiteList from '$lib/SiteList.svelte'
  import GitHubCorner from 'svelte-github-corner'
  import sites from '../sites.yml'
  import {
    contributor_filter_mode,
    filter_contributors,
    filter_tags,
    search,
    sort_by,
    tag_filter_mode,
  } from '../stores'
  import type { PageData } from './$types'
  import { repo_url } from './+layout'

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

<GitHubCorner href={repo_url} />

<main>
  <h1>
    <img
      src="/awesome-sveltekit-banner.svg"
      alt="Awesome SvelteKit"
      style="max-height: 120px;"
    />
    <br />
    {sites.length} Awesome Examples of SvelteKit in the Wild
  </h1>

  <p>
    See something that's missing from this list?
    <a href="{repo_url}/edit/main/sites.yml"> PRs welcome! </a>
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

  <h2>🎉 Open to Suggestions</h2>
  <p style="max-width: 40em;">
    See something that's missing from this list? <a href="{repo_url}/edit/main/sites.yml"
      >PRs welcome</a
    >! A good place to discover Svelte projects (not necessarily SvelteKit) is
    <a href="https://github.com/trending/svelte?since=monthly">GitHub Trending</a>. If
    anything on that list stands out to you but is missing here, please add it!
  </p>

  <h2>
    🙏 Big thanks to <a href="{repo_url}/graphs/contributors" target="_blank">
      all {data.contributors.length} contributors
    </a>
  </h2>
  <ul class="contributors">
    {#each data.contributors as { avatar_url, html_url, login }}
      <li>
        <a href={html_url}>
          <img src={avatar_url} alt={login} />
        </a>
      </li>
    {/each}
  </ul>
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
  ul.contributors {
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    list-style: none;
    padding: 0;
  }
  ul.contributors img {
    width: 60px;
    border-radius: 50%;
    margin: 1ex;
  }
</style>
