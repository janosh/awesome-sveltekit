<script lang="ts">
  import { ContributorList, Filters, SiteList } from '$lib'
  import { filters, sorted } from '$lib/state.svelte'
  import { repository } from '$site/package.json'
  import Icon from '@iconify/svelte'
  import sites from '../sites.yml'
  import type { Snapshot } from './$types'

  let { data } = $props()

  const tags = Object.entries(
    sites
      .flatMap((site) => site.tags)
      .reduce(
        (acc, el) => {
          acc[el] = (acc[el] ?? 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
  ).filter(([, count]) => count > 2)
  tags.sort(([t1], [t2]) => t1.localeCompare(t2))

  const contributors = Object.entries(
    sites
      .flatMap(
        (site) =>
          site.contributors
            ?.map((c) => c.name)
            .filter((name) => ![null, `Janosh Riebesell`].includes(name)) ?? [],
      )
      .reduce(
        (acc, el) => {
          acc[el] = (acc[el] ?? 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
  ).sort((contrib1, contrib2) => contrib2[1] - contrib1[1])

  function arr_includes(
    arr: string[],
    values: string[],
    mode: `all` | `any`,
  ): boolean {
    if (values.length === 0) return true
    if (arr.length === 0) return false
    if (mode === `all`) return values.every((val) => arr.includes(val))
    if (mode === `any`) return values.some((val) => arr.includes(val))
    else throw `Unexpected filter mode=${mode}`
  }

  let sort_order: `asc` | `desc` = $state(`desc`)
  let sort_factor = $derived(sort_order == `desc` ? 1 : -1)
  // arr.sort() sorts in-place but we need to reassign filtered_sites so Svelte rerenders
  $effect(() => {
    const filtered_sites = sites.filter((site) => {
      const query_match = filters.search?.length === 0 ||
        JSON.stringify(site).includes(filters.search)

      const tag_match = arr_includes(
        site.tags ?? [],
        filters.tags.map((t) => t.label), // tags the site should have
        filters.tags_mode, // all or any
      )
      const contrib_match = arr_includes(
        site.contributors?.map((c) => c.name) ?? [],
        filters.contributors.map((c) => c.label), // contributors the site should have
        filters.contributors_mode, // all or any
      )

      return query_match && tag_match && contrib_match
    })

    if (sorted.by[0] === `GitHub repo stars`) {
      sorted.sites = filtered_sites.sort(
        (siteA, siteB) =>
          sort_factor * ((siteB.repo_stars ?? 0) - (siteA.repo_stars ?? 0)),
      )
    } else if (sorted.by[0] === `Date created`) {
      sorted.sites = filtered_sites.sort(
        (siteA, siteB) => sort_factor * (+siteB.date_created - +siteA.date_created),
      )
    }
  })

  const meta_description = `Awesome examples of SvelteKit sites in the wild`

  export const snapshot: Snapshot = {
    capture: () => ({ sort_order }),
    restore: (values) => ({ sort_order } = values),
  }
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

  <Filters {tags} bind:sort_order {contributors} />

  {#if sorted.sites.length < sites.length}
    <p>
      <span>{sorted.sites.length}</span> match{sorted.sites.length !== 1 ? `es` : ``}
      {#if sorted.sites?.length === 0}
        (try different filters)
      {/if}
    </p>
  {/if}

  <SiteList sites={sorted.sites} />

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
    PRs welcome</a>! This collection is meant as a learning resource for Svelte devs.
  While a site with private code can give inspiration, there's little educational value if
  you can't inspect how it was made.
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
