<script lang="ts">
  import MarkGithub from '@svicons/octicons/mark-github.svelte'
  import Person from '@svicons/octicons/person.svelte'
  import Project from '@svicons/octicons/project.svelte'
  import Stack from '@svicons/octicons/stack.svelte'
  import Tag from '@svicons/octicons/tag.svelte'
  import { Site } from '../types'
  import Creator from './Creator.svelte'
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

<main>
  <section style="flex: 2;">
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
    <div>
      <Person width="1em" />&emsp;Creator{creators.length > 1 ? `s` : ``}:
      {#if creators.length > 1}
        <ol class="creators">
          {#each creators as creator}
            <li>
              <Creator {creator} />
            </li>
          {/each}
        </ol>
      {:else}
        &nbsp;&emsp;<Creator creator={creators[0]} />
      {/if}
    </div>
    {#if dateCreated}
      <hr />
      <p class="flex">
        <Project width="1em" />&emsp;Project started on: {prettyDate(dateCreated)}
      </p>
    {/if}
    {#if tags?.length > 0}
      <hr />
      <p>
        <Tag width="1em" height="1.2em" />&emsp;Tags:
        {tags.join(`, `)}
      </p>
    {/if}
    {#if uses && uses?.length > 0}
      <hr />
      <p class="flex">
        <Stack width="1em" height="1.2em" />&emsp;Uses: {uses.join(`, `)}
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
  ol.creators {
    line-height: 1.6em;
  }
</style>
