<script lang="ts">
  import Twitter from '@svicons/fa-brands/twitter.svelte'
  import LinkExternal from '@svicons/octicons/link-external.svelte'
  import MarkGithub from '@svicons/octicons/mark-github.svelte'
  import Person from '@svicons/octicons/person.svelte'
  import Project from '@svicons/octicons/project.svelte'
  import Tag from '@svicons/octicons/tag.svelte'
  import { Site } from '../types'
  import Screenshot from './Screenshot.svelte'

  export let site: Site

  $: ({ title, url, tags, uses, creators, dateCreated } = site)

  const prettyDate = (date = ``): string =>
    new Date(date).toLocaleString(`en`, {
      month: `short`,
      year: `numeric`,
      day: `numeric`,
    })
</script>

<div>
  <main style="flex: 2;">
    <h1 class="flex" style="gap: 1em; justify-content: space-between;">
      <a href={url}>{title}</a>
      {#if site.repo}
        <small class="flex" style="gap: 6pt;">
          <MarkGithub width="1.2em" /><a href={site.repo}>Repo</a>
        </small>
      {/if}
    </h1>

    {#if site.description}
      <p>{site.description}</p>
    {/if}
    <hr />
    <p class="flex">
      <Person width="1em" />&emsp;Creator{creators.length > 1 ? `s` : ``}:
      {#each creators as creator, idx}
        {#if idx > 0}&ensp;+&ensp;{/if}
        {creator.name}
        {#if creator.url}&nbsp;
          <a href={creator.url} class="flex">
            <LinkExternal width="1.1em" />
          </a>
        {/if}
        {#if creator.twitter}&nbsp;
          <a href="https://twitter.com/@{creator.twitter}" class="flex">
            <Twitter width="1.1em" />
          </a>
        {/if}
      {/each}
    </p>
    {#if dateCreated}
      <hr />
      <p class="flex">
        <Project width="1em" />&emsp;Project started on: {prettyDate(dateCreated)}
      </p>
    {/if}
    {#if tags?.length > 0}
      <hr />
      <p class="flex">
        <Tag width="1em" height="1.2em" />&emsp;Tags: {tags.join(`, `)}
      </p>
    {/if}
    {#if uses && uses?.length > 0}
      <hr />
      <p class="flex">
        <Tag width="1em" height="1.2em" />&emsp;Uses: {uses.join(`, `)}
      </p>
    {/if}
  </main>
  <figure style="flex: 3;"><Screenshot {title} /></figure>
</div>

<style>
  div {
    display: flex;
    max-width: 1000px;
    gap: 2em;
    margin: 6em auto 2em;
  }
  @media (max-width: 600px) {
    div {
      flex-direction: column;
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
</style>
