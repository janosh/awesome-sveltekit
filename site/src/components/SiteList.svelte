<script lang="ts">
  import type { Site } from '../global'
  import Modal from './Modal.svelte'
  import Screenshot from './Screenshot.svelte'
  import MarkGithub from '@svicons/octicons/mark-github.svelte'
  import Tag from '@svicons/octicons/tag.svelte'

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
  {#each sites as { title, url, tags, creator, creatorTwitter, creatorUrl, dateCreated, description, repo } (url)}
    <li>
      <Screenshot {title} on:click={() => (activeSite = url)} />
      <a href={url} on:click|stopPropagation>{title}</a><br />
      <small>{tags.join(`, `)}</small>
    </li>
    {#if activeSite === url}
      <Modal on:close={() => (activeSite = null)} style="background: #2c2b35;">
        <div>
          <h1 class="flex" style="gap: 1em; justify-content: space-between;">
            <a href={url}>{title}</a>
            {#if repo}
              <small class="flex" style="gap: 6pt;">
                <MarkGithub width="1.2em" /><a href={repo}>Code</a>
              </small>
            {/if}
          </h1>
          <Screenshot {title} />
          {#if description}
            <p>{description}</p>
          {/if}
          <p class="flex">
            Creator: {creator}
            {#if creatorUrl}
              &nbsp;&mdash;&nbsp;<a href={creatorUrl}>Web</a>
            {/if}
            {#if creatorTwitter}
              &nbsp;&mdash;&nbsp;<a href="https://twitter.com/@{creatorTwitter}">
                Twitter</a>
            {/if}
            {#if repo}
              &nbsp;&mdash;&nbsp;<img
                src="https://img.shields.io/github/stars/{repo
                  .split('/')
                  .slice(3, 5)
                  .join('/')}"
                alt="GitHub repo stars"
                height="16pt" />
            {/if}
          </p>
          {#if dateCreated}
            <p>Project started on: {prettyDate(dateCreated)}</p>
          {/if}
          {#if tags?.length > 0}
            <p class="flex"><Tag width="1.2em" />&nbsp;Tags: {tags.join(`, `)}</p>
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
  ol li img {
    cursor: pointer;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  h1 small {
    font-size: 14pt;
  }
</style>
