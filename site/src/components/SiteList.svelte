<script lang="ts">
  import { Site } from '../types'
  import Modal from './Modal.svelte'
  import Screenshot from './Screenshot.svelte'
  import MarkGithub from '@svicons/octicons/mark-github.svelte'
  import Star from '@svicons/octicons/star.svelte'
  import Tag from '@svicons/octicons/tag.svelte'
  import LinkExternal from '@svicons/octicons/link-external.svelte'
  import Twitter from '@svicons/fa-brands/twitter.svelte'
  import Project from '@svicons/octicons/project.svelte'
  import Person from '@svicons/octicons/person.svelte'

  export let sites: Site[]

  let activeSite: string | null = null

  const prettyDate = (date = ``): string =>
    new Date(date).toLocaleString(`en`, {
      month: `short`,
      year: `numeric`,
      day: `numeric`,
    })
</script>

<ol>
  {#each sites as { title, url, tags, creator, creatorTwitter, creatorUrl, dateCreated, description, repo, repoStars }, idx (url)}
    <li>
      <Screenshot {title} on:click={() => (activeSite = url)} />
      <div class="flex" style="justify-content: space-between;">
        <span>
          {idx + 1}.
          <!-- stopPropagation to prevent opening modal -->
          <a href={url} on:click|stopPropagation>{title}</a>
        </span>
        {#if repoStars}
          <small class="flex"><Star width="1em" />&nbsp;{repoStars}</small>
        {/if}
      </div>
      <p>
        <small>{tags.join(`, `)}</small>
      </p>
    </li>
    {#if activeSite === url}
      <Modal on:close={() => (activeSite = null)} style="background: #2c2b35;">
        <div>
          <h1 class="flex" style="gap: 1em; justify-content: space-between;">
            <a href={url}>{title}</a>
            {#if repo}
              <small class="flex" style="gap: 6pt;">
                <MarkGithub width="1.2em" /><a href={repo}>Repo</a>
              </small>
            {/if}
          </h1>
          <Screenshot {title} />
          {#if description}
            <p>{description}</p>
          {/if}
          <p class="flex">
            <Person width="1em" />&emsp;Creator:&nbsp;
            {#if creatorUrl}
              <a href={creatorUrl} class="flex">
                {creator}&nbsp;<LinkExternal width="1em" /></a>
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
      </Modal>
    {/if}
  {/each}
</ol>

<style>
  ol {
    list-style: none;
    padding: 0;
    display: grid;
    grid-gap: 2em;
    grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
  }
  .flex {
    display: flex;
    align-items: center;
  }
  h1 small {
    font-size: 14pt;
  }
</style>
