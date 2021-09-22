<script lang="ts">
  import type { Site } from '../global'
  import Modal from '../components/Modal.svelte'

  export let sites: Site[]

  let activeSite: string | null = null

  const prettyDate = (date = ``): string => new Date(date).toISOString().split(`T`)[0]
</script>

<ol>
  {#each sites as { title, url, tags, creator, creatorTwitter, creatorUrl, dateCreated, description } (url)}
    <li>
      <img
        on:click={() => (activeSite = url)}
        src="/screenshots/{title.toLowerCase().replaceAll(` `, `-`)}.png"
        alt="Screenshot of {title}" />
      <a href={url} on:click|stopPropagation>{title}</a><br />
      <small>{tags.join(`, `)}</small>
    </li>
    {#if activeSite === url}
      <Modal on:close={() => (activeSite = null)} style="background: #2c2b35;">
        <div>
          <h1>
            <a href={url}>{title}</a>
          </h1>
          <img src="/screenshots/{title.toLowerCase().replaceAll(` `, `-`)}.png" alt="" />
          <p>{description}</p>
          <p>
            Creator: {creator}
            {#if creatorUrl}
              &nbsp;&mdash;&nbsp; <a href={creatorUrl}>Web</a>
            {/if}
            {#if creatorTwitter}
              &nbsp;&mdash;&nbsp; <a href="https://twitter.com/@{creatorTwitter}"
                >Twitter</a>
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
</style>
