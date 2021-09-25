<script lang="ts">
  import type { Site } from '../global'
  import Modal from '../components/Modal.svelte'
  import MarkGithub from '@svicons/octicons/mark-github.svelte'

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
      <img
        on:click={() => (activeSite = url)}
        src="/screenshots/{title.toLowerCase().replaceAll(` `, `-`)}.webp"
        alt="Screenshot of {title}" />
      <a href={url} on:click|stopPropagation>{title}</a><br />
      <small>{tags.join(`, `)}</small>
    </li>
    {#if activeSite === url}
      <Modal on:close={() => (activeSite = null)} style="background: #2c2b35;">
        <div>
          <h1
            style="display: flex; align-items: center; gap: 1em; justify-content: space-between;">
            <a href={url}>{title}</a>
            {#if repo}
              <small style="display: flex; align-items: center; gap: 6pt;">
                <MarkGithub width="1.2em" /><a href={repo}>Code</a>
              </small>
            {/if}
          </h1>
          <img
            src="/screenshots/{title.toLowerCase().replaceAll(` `, `-`)}.webp"
            alt={title} />
          {#if description}
            <p>{description}</p>
          {/if}
          <p>
            Creator: {creator}
            {#if creatorUrl}
              &nbsp;&mdash;&nbsp;<a href={creatorUrl}>Web</a>
            {/if}
            {#if creatorTwitter}
              &nbsp;&mdash;&nbsp;<a href="https://twitter.com/@{creatorTwitter}">
                Twitter</a>
            {/if}
          </p>
          {#if dateCreated}
            <p>Project started on: {prettyDate(dateCreated)}</p>
          {/if}
          {#if tags?.length > 0}
            <p>Tags: {tags.join(`, `)}</p>
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
  img {
    width: 100%;
  }
</style>
