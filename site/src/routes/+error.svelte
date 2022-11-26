<script lang="ts">
  import { page } from '$app/stores'
  import Icon from '@iconify/svelte'
  import { homepage, name } from '../../package.json'

  let online: boolean
</script>

<svelte:head>
  <title>Error {$page.status} &bull; {name}</title>
</svelte:head>

<svelte:window bind:online />

<div>
  <h1>Error {String($page.status).replace(`0`, `😵`)}: {$page.error?.message}</h1>
  {#if $page.status >= 500}
    <p>
      If page reloading doesn't help, please raise an issue on
      <a href="{homepage}/issues" target="_blank" rel="noreferrer">GitHub</a>. Thanks! 🙏
    </p>
  {/if}
  {#if online === false}
    Looks like you're offline. If you think your connection is fine, check the
    <a href="https://githubstatus.com">GitHub status page</a>
    as this site is hosted by &thinsp;<Icon icon="octicon:mark-github" inline />&thinsp;
    GitHub Pages.
  {/if}

  <p>
    Back to <a href=".">
      <img src="favicon.svg" alt={name} height="30" />
      landing page
    </a>.
  </p>
</div>

<style>
  div {
    font-size: 1.2em;
    max-width: 45em;
    padding: 5em 3em 1em;
    margin: auto;
    text-align: center;
  }
  p img {
    vertical-align: middle;
    margin: 0 1pt 0 3pt;
  }
</style>
