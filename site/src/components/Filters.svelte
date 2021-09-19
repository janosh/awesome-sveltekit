<script lang="ts">
  import MultiSelect from 'svelte-multiselect'

  export let tags: string[]
  export let filterTags: string[]
  export let query = ``
</script>

<div>
  <input type="search" bind:value={query} placeholder="Search..." />
  <MultiSelect options={tags} placeholder="Filter by tag..." bind:selected={filterTags} />
</div>

<style>
  div {
    display: flex;
    place-content: center;
    max-width: 40em;
    margin: auto;
    place-items: center;
    gap: 1em;
  }
  :global(.multiselect) {
    box-shadow: 0 0 1pt gray;
    border: none !important;
    display: inline-flex !important;
    font-size: 14pt;
    min-width: 12em;
    background-color: black !important;
    padding: 4pt 1ex;
  }
  :global(.multiselect ul.options) {
    background-color: black !important;
  }
  input {
    font-size: 14pt;
    border: none;
    outline: none;
    padding: 4pt 1ex;
    border-radius: 3pt;
    color: inherit;
    background: black;
    box-shadow: 0 0 1pt gray;
  }
</style>
