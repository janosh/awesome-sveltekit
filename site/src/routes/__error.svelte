<script lang="ts" context="module">
  import { dev } from '$app/env'
  import type { ErrorLoad } from '@sveltejs/kit'

  export const load: ErrorLoad = ({ error, status }) => ({ props: { error, status } })
</script>

<script lang="ts">
  export let status: number
  export let error: Error
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div>
  {#if status === 404}
    <h1>⛔ {error.name} {status}: Page not found</h1>
    <p>
      Return to the
      <a sveltekit:prefetch href="/">landing page</a>.
    </p>
  {:else}
    <h1>⛔ {error.name} {status}</h1>
  {/if}

  {#if dev && error?.stack}
    <h2>Stack Trace</h2>
    <pre>{error.stack}</pre>
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
