<script lang="ts">
  import uses_links from '$root/tools.yml'
  import Icon from '@iconify/svelte'
  import { Tooltip } from 'svelte-zoo'
  import { Person, Screenshot, type Site } from '.'

  export let site: Site

  $: ({ title, url, tags, uses, contributors, date_created, repo_stars } = site)

  $: days_since_created = Math.floor(
    (Date.now() - date_created.getTime()) / (1000 * 60 * 60 * 24)
  )

  $: tools = uses.map((tool) => {
    const href = uses_links[tool.toLowerCase()]
    if (!href) {
      console.error(`Unknown tool: ${tool}`)
    } else if (!href.startsWith(`https`)) {
      // all tools should have an https URL
      throw `All tool URLs should use HTTPS: ${tool} has href: ${href}`
    }
    return [tool, href]
  })
</script>

<section>
  <h1>
    <a href={url}>{title}</a>
    <small style="display: flex; gap: 10pt; place-items: center;">
      {#if site.repo}
        <a href={site.repo}>
          <Icon icon="octicon:mark-github" color="white" />
        </a>
      {/if}
      {#if site.npm}
        <a href={site.npm}>
          <Icon icon="teenyicons:npm-solid" color="white" height="2.5ex" />
        </a>
      {/if}
    </small>
  </h1>

  {#if site.description}
    <p>{@html site.description}</p>
  {/if}
  {#if site.repo && repo_stars}
    <hr />
    <p class="flex">
      <Icon icon="octicon:star" />&emsp;Stars
      <span style="flex: 1" />
      <a href="{site.repo}/stargazers">{repo_stars.toLocaleString()}</a>
    </p>
  {/if}
  {#if contributors?.length > 0}
    <hr />
    <div class:flex={contributors.length === 1} style="margin: 1em 0;">
      <Icon icon="octicon:person" style="margin-right: 1em;" />
      {#if site.repo}
        <a href="{site.repo}/contributors">
          {contributors.length > 1 ? `Contributors` : `Creator`}
        </a>
      {:else}
        {contributors.length > 1 ? `Contributors` : `Creator`}
      {/if}
      {#if contributors.length > 1}
        <ol class="contributors">
          {#each contributors as person}
            <li>
              <Person {person} />
            </li>
          {/each}
        </ol>
      {:else}
        <span style="flex: 1" />
        <Person person={contributors[0]} />
      {/if}
    </div>
  {/if}
  {#if date_created}
    <hr />
    <p class="flex">
      <Icon icon="octicon:project" />&emsp;Project started on
      <span style="flex: 1" />
      <Tooltip
        text="{days_since_created} days ago"
        min_width="max-content"
        style="--zoo-tooltip-bg: var(--sms-options-bg)"
      >
        {#if site.repo}
          <a href="{site.repo}/network">{date_created.toISOString().split(`T`)[0]}</a>
        {:else}
          {date_created.toISOString().split(`T`)[0]}
        {/if}
      </Tooltip>
    </p>
  {/if}
  {#if tags?.length > 0}
    <hr />
    <p class="tags flex">
      <Icon icon="octicon:tag" />&ensp;Tags&emsp;
      {#each tags as tag}
        <span>{tag}</span>
      {/each}
    </p>
  {/if}
  {#if tools && tools?.length > 0}
    <hr />
    <p class="uses flex">
      <Icon icon="octicon:stack-16" />&ensp;Uses&emsp;
      {#each tools as [tool, href]}
        <a {href}>{tool}</a>
      {/each}
    </p>
  {/if}
</section>
<aside>
  <Screenshot {title} />
</aside>

<style>
  h1 {
    display: flex;
    gap: 1em;
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
  }
  h1 small {
    font-size: 14pt;
  }
  hr {
    height: 0.1px;
    background-color: lightblue;
    border: none;
  }
  @media (max-width: 750px) {
    aside {
      max-width: 500px;
      margin: auto;
    }
  }
  ol.contributors {
    line-height: 1.6em;
  }
  p.uses,
  p.tags {
    gap: 5pt;
  }
  p.uses a,
  p.tags span {
    background-color: rgba(255, 255, 255, 0.1);
    line-height: 1.2em;
    padding: 1pt 3pt;
    margin: 3pt 0;
    border-radius: 3pt;
  }
</style>
