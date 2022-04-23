<script lang="ts">
  import MarkGithub from '~icons/octicon/mark-github'
  import Person from '~icons/octicon/person'
  import Project from '~icons/octicon/project'
  import Stack from '~icons/octicon/stack-16'
  import Star from '~icons/octicon/star'
  import Tag from '~icons/octicon/tag'
  import { Site } from '../types'
  import Contributor from './Contributor.svelte'
  import Screenshot from './Screenshot.svelte'

  export let site: Site

  $: ({ title, url, tags, uses, contributors, dateCreated, repoStars } = site)

  const prettyDate = (date = ``): string =>
    new Date(date).toLocaleString(`en`, {
      month: `short`,
      year: `numeric`,
      day: `numeric`,
    })
</script>

<main>
  <section style="flex: 2;">
    <h1 class="flex" style="gap: 1em; justify-content: space-between;">
      <a href={url}>{title}</a>
      {#if site.repo}
        <a href={site.repo}>
          <small class="flex" style="gap: 6pt;">
            <MarkGithub width="1.2em" color="white" />Repo
          </small>
        </a>
      {/if}
    </h1>

    {#if site.description}
      <p>{@html site.description}</p>
    {/if}
    {#if repoStars}
      <hr />
      <p class="flex">
        <Star width="1em" />&emsp;Star count: <span style="flex: 1" />{repoStars}
      </p>
    {/if}
    {#if contributors?.length > 0}
      <hr />
      <div class:flex={contributors.length === 1} style="margin: 1em 0;">
        <Person width="1em" style="margin-right: 1em;" /> &emsp; {contributors.length > 1
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
    {#if dateCreated}
      <hr />
      <p class="flex">
        <Project width="1em" />&emsp;Project started on:
        <span style="flex: 1" />{prettyDate(dateCreated)}
      </p>
    {/if}
    {#if tags?.length > 0}
      <hr />
      <p>
        <span><Tag width="1em" height="1.2em" />&emsp;Tags:</span>
        {tags.join(`, `)}
      </p>
    {/if}
    {#if uses && uses?.length > 0}
      <hr />
      <p class="flex">
        <Stack width="1em" height="1.2em" />&emsp;Uses:
        <span style="flex: 1" />{uses.join(`, `)}
      </p>
    {/if}
  </section>
  <aside style="flex: 3;"><Screenshot {title} /></aside>
</main>

<style>
  main {
    display: flex;
    max-width: 1000px;
    gap: 2em;
    margin: 6em auto 2em;
  }
  @media (max-width: 600px) {
    main {
      flex-direction: column-reverse;
      gap: 1em;
    }
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
</style>
