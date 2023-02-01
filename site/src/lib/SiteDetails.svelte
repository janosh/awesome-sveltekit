<script lang="ts">
  import uses_links from '$root/tools.yml'
  import Icon from '@iconify/svelte'
  import type { Site } from '.'
  import { Contributor, Screenshot } from '.'

  export let site: Site

  $: ({ title, url, tags, uses, contributors, date_created, repo_stars } = site)

  $: tools = uses.map((tool) => {
    const href = uses_links[tool.toLowerCase()]
    if (!href) {
      throw `Unknown tool: ${tool}`
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
    {#if site.repo}
      <a href={site.repo}>
        <small style="display: flex; gap: 6pt;">
          <Icon icon="octicon:mark-github" color="white" />Repo
        </small>
      </a>
    {/if}
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
          {#each contributors as contributor}
            <li>
              <Contributor {contributor} />
            </li>
          {/each}
        </ol>
      {:else}
        <span style="flex: 1" />
        <Contributor contributor={contributors[0]} />
      {/if}
    </div>
  {/if}
  {#if date_created}
    <hr />
    <p class="flex">
      <Icon icon="octicon:project" />&emsp;Project started on
      <span style="flex: 1" />
      {#if site.repo}
        <a href="{site.repo}/network">{date_created}</a>
      {:else}
        {date_created}
      {/if}
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
