<script lang="ts">
  import Icon from '@iconify/svelte'
  import uses_links from '../../../uses-links.yml'
  import { Site } from '../types'
  import Contributor from './Contributor.svelte'
  import Screenshot from './Screenshot.svelte'

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

<main>
  <section style="flex: 2;">
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
    {#if repo_stars}
      <hr />
      <p class="flex">
        <Icon icon="octicon:star" />&emsp;Star count:
        <span style="flex: 1" />{repo_stars.toLocaleString()}
      </p>
    {/if}
    {#if contributors?.length > 0}
      <hr />
      <div class:flex={contributors.length === 1} style="margin: 1em 0;">
        <Icon icon="octicon:person" style="margin-right: 1em;" />{contributors.length > 1
          ? `Contributors`
          : `Creator`}:
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
        <Icon icon="octicon:project" />&emsp;Project started on:
        <span style="flex: 1" />{date_created}
      </p>
    {/if}
    {#if tags?.length > 0}
      <hr />
      <p class="tags flex">
        <Icon icon="octicon:tag" />&ensp;Tags:&emsp;
        {#each tags as tag}
          <span>{tag}</span>
        {/each}
      </p>
    {/if}
    {#if tools && tools?.length > 0}
      <hr />
      <p class="uses flex">
        <Icon icon="octicon:stack-16" />&ensp;Uses:&emsp;
        {#each tools as [tool, href]}
          <a {href}>{tool}</a>
        {/each}
      </p>
    {/if}
  </section>
  <aside style="flex: 3;">
    <Screenshot {title} />
  </aside>
</main>

<style>
  main {
    display: flex;
    max-width: 1200px;
    gap: 2em;
    margin: 6em auto 2em;
  }
  @media (max-width: 750px) {
    main {
      flex-direction: column-reverse;
      gap: 1em;
    }
    aside {
      max-width: 500px;
      margin: auto;
    }
  }
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
