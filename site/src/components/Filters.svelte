<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import MultiSelect from 'svelte-multiselect'
  import { filterTags, sortBy, sortByOptions, tagFilterMode } from '../stores'
  import RadioButtons from './RadioButtons.svelte'

  export let tags: [string, number][]
  export let query = ``
  let selectedTags: { label: string; value: string }[] = []

  const dispatch = createEventDispatcher()
  filterTags.subscribe((tags) => {
    selectedTags = tags.map((tag) => ({ label: tag, value: tag }))
  })
</script>

<div class="filters">
  <input type="search" bind:value={query} placeholder="Search..." />
  <div>
    <MultiSelect
      options={tags.map((el) => el[0])}
      placeholder="Filter by tag..."
      bind:selectedLabels={$filterTags}
      bind:selected={selectedTags}
    >
      <span slot="option" let:idx style="display: flex; justify-content: space-between;">
        {tags[idx][0]} <span />
        {tags[idx][1]}
      </span>
    </MultiSelect>
    {#if $filterTags.length > 0}
      <RadioButtons bind:selected={$tagFilterMode} options={[`and`, `or`]} />
    {/if}
  </div>
  <div>
    <MultiSelect
      options={sortByOptions.filter(Boolean)}
      placeholder="Sort by..."
      maxSelect={1}
      on:change={(e) => ($sortBy = e.detail.option.label)}
    />
    {#if $sortBy !== ``}
      <RadioButtons
        selected="desc"
        on:change={() => dispatch(`toggleSort`)}
        options={[`asc`, `desc`]}
      />
    {/if}
  </div>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    gap: 1em;
  }
  div.filters {
    place-content: center;
    flex-wrap: wrap;
    margin: 2em auto;
  }
  input[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
    height: 1em;
    width: 1em;
    background: url(/favicon.svg) no-repeat;
    cursor: pointer;
  }
</style>
