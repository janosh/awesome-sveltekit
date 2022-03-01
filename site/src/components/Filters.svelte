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
    --sms-input-height="none"
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
    --sms-input-height="none"
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
  :global(.multiselect) {
    box-shadow: 0 0 1pt gray;
    border: none;
    display: inline-flex;
    min-width: 12em;
    background-color: black;
    padding: 4pt 1ex;
    margin: 0;
  }
  :global(.multiselect ul.options) {
    background-color: black;
  }
  :global(.multiselect ul.options li) {
    margin: 0;
  }
  input[type='search'] {
    border: none;
    outline: none;
    padding: 4pt 1ex;
    border-radius: 4pt;
    color: inherit;
    background: black;
    box-shadow: 0 0 1pt gray;
    line-height: 18pt;
    font-size: 1em;
    min-width: 26ex;
  }
  input[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    background: url(/favicon.svg) no-repeat;
    cursor: pointer;
  }
</style>
