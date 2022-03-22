<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import MultiSelect from 'svelte-multiselect'
  import { filterTags, sortBy, sortByOptions, tagFilterMode } from '../stores'
  import RadioButtons from './RadioButtons.svelte'

  export let tags: string[]
  export let query = ``
  let selectedTags: { label: string; value: string }[] = []

  const dispatch = createEventDispatcher()
  filterTags.subscribe((tags) => {
    selectedTags = tags.map((tag) => ({ label: tag, value: tag }))
  })
</script>

<div>
  <input type="search" bind:value={query} placeholder="Search..." />
  <MultiSelect
    options={tags}
    placeholder="Filter by tag..."
    bind:selectedLabels={$filterTags}
    bind:selected={selectedTags}
  />
  {#if $filterTags.length > 0}
    <RadioButtons
      selected="AND"
      on:change={({ detail }) => ($tagFilterMode = detail.value)}
      options={[`AND`, `OR`]}
    />
  {/if}
  <MultiSelect
    options={sortByOptions.filter(Boolean)}
    placeholder="Sort by..."
    maxSelect={1}
    on:change={(e) => ($sortBy = e.detail.option.label)}
  />
  {#if $sortBy !== ``}
    <RadioButtons
      selected="Descending"
      on:change={() => dispatch(`toggleSort`)}
      options={[`Ascending`, `Descending`]}
    />
  {/if}
</div>

<style>
  div {
    display: flex;
    flex-wrap: wrap;
    place-content: center;
    align-items: center;
    margin: 2em auto;
    gap: 1em;
  }
  input[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    background: url(/favicon.svg) no-repeat;
    cursor: pointer;
  }
</style>
