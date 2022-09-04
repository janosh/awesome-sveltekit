<script lang="ts">
  import { dev } from '$app/environment'
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>{$page.status}</title>
</svelte:head>

<div>
  {#if $page.status === 404}
    <h1>⛔ {$page.error?.name} {$page.status}: Page not found</h1>
    <p>
      Return to the
      <a data-sveltekit-prefetch href="/">landing page</a>.
    </p>
  {:else}
    <h1>⛔ {$page.error?.name} {$page.status}</h1>
  {/if}

  {#if dev && $page.error?.stack}
    <h2>Stack Trace</h2>
    <pre>{$page.error.stack}</pre>
  {/if}
</div>

<style>
  div {
    font-size: 1.2em;
    max-width: 45em;
    padding: 5em 3em 1em;
    margin: auto;
    text-align: center;
  }
  p {
    text-align: center;
    max-width: 35em;
    margin: auto;
  }
  pre {
    overflow: scroll;
    font-size: 0.9em;
    white-space: pre-wrap;
    background: var(--accentBg);
    padding: 5pt 1em;
    border-radius: 3pt;
  }
</style>
