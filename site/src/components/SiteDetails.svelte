<script lang="ts">
  import MarkGithub from '@svicons/octicons/mark-github.svelte'
  import Tag from '@svicons/octicons/tag.svelte'
  import LinkExternal from '@svicons/octicons/link-external.svelte'
  import Twitter from '@svicons/fa-brands/twitter.svelte'
  import Project from '@svicons/octicons/project.svelte'
  import Person from '@svicons/octicons/person.svelte'
  import Screenshot from './Screenshot.svelte'

  import { Site } from '../types'

  export let site: Site

  $: ({ title, url, tags, creator, creatorTwitter, creatorUrl, dateCreated } = site)

  const prettyDate = (date = ``): string =>
    new Date(date).toLocaleString(`en`, {
      month: `short`,
      year: `numeric`,
      day: `numeric`,
    })
</script>

<div>
  <h1 class="flex" style="gap: 1em; justify-content: space-between;">
    <a href={url}>{title}</a>
    {#if site.repo}
      <small class="flex" style="gap: 6pt;">
        <MarkGithub width="1.2em" /><a href={site.repo}>Repo</a>
      </small>
    {/if}
  </h1>
  <Screenshot {title} />
  {#if site.description}
    <p>{site.description}</p>
  {/if}
  <p class="flex">
    <Person width="1em" />&emsp;Creator:&nbsp;
    {#if creatorUrl}
      <a href={creatorUrl} class="flex"> {creator}&nbsp;<LinkExternal width="1em" /></a>
    {:else}
      {creator}
    {/if}
    {#if creatorTwitter}&nbsp;&mdash;&nbsp;
      <a href="https://twitter.com/@{creatorTwitter}" class="flex">
        <Twitter width="1.1em" />&nbsp;@{creatorTwitter}</a>
    {/if}
  </p>
  {#if dateCreated}
    <p class="flex">
      <Project width="1em" />&emsp;Project started on: {prettyDate(dateCreated)}
    </p>
  {/if}
  {#if tags?.length > 0}
    <p class="flex">
      <Tag width="1em" height="1.2em" />&emsp;Tags: {tags.join(`, `)}
    </p>
  {/if}
</div>

<style>
  h1 small {
    font-size: 14pt;
  }
</style>
