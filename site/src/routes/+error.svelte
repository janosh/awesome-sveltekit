<script lang="ts">
  import { page } from '$app/stores'
</script>

<svelte:head>
  <title>{$page.status}</title>
</svelte:head>

<div>
  <h1>Error {$page.status}: {$page.error?.message}</h1>

  <p>Back to <a href=".">landing page</a>.</p>
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
</style>
