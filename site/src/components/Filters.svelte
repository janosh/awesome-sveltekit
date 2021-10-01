<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import MultiSelect from 'svelte-multiselect'
  import RadioButtons from './RadioButtons.svelte'

  import { sortByOptions, sortBy, filterTags } from '../stores'

  export let tags: string[]
  export let query = ``

  const dispatch = createEventDispatcher()
</script>

<div>
  <input type="search" bind:value={query} placeholder="Search..." />
  <MultiSelect
    options={tags}
    placeholder="Filter by tag..."
    bind:selected={$filterTags} />
  <MultiSelect
    options={sortByOptions.filter(Boolean)}
    placeholder="Sort by..."
    maxSelect={1}
    bind:selected={$sortBy} />
  {#if $sortBy.length > 0}
    <RadioButtons
      selected="Descending"
      on:change={() => dispatch(`toggleSort`)}
      options={[`Ascending`, `Descending`]} />
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
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
    min-width: 12em;
    background-color: black !important;
    padding: 4pt 1ex;
  }
  :global(.multiselect ul.options) {
    background-color: black !important;
  }
  :global(.multiselect ul.options li) {
    margin: 0;
  }
  input[type='search'] {
    border: none;
    outline: none;
    padding: 4pt 1ex;
    border-radius: 3pt;
    color: inherit;
    background: black;
    box-shadow: 0 0 1pt gray;
  }
</style>
