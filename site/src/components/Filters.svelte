<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import MultiSelect from 'svelte-multiselect'
  import { filterTags, sortBy, tagFilterMode, search } from '../stores'
  import RadioButtons from './RadioButtons.svelte'

  export let tags: [string, number][]

  const dispatch = createEventDispatcher()
</script>

<div class="filters">
  <input type="search" bind:value={$search} placeholder="Search..." />
  <div>
    <MultiSelect
      options={tags.map(([label, count]) => ({ label, count }))}
      placeholder="Filter by tag..."
      bind:selected={$filterTags}
    >
      <span slot="option" let:option style="display: flex;">
        {option.label} <span style="flex: 1;" />
        {option.count}
      </span>
    </MultiSelect>
    {#if $filterTags.length > 1}
      <RadioButtons bind:selected={$tagFilterMode} options={[`and`, `or`]} />
    {/if}
  </div>
  <div>
    <MultiSelect
      options={[`Date created`, `Date last updated`, `GitHub repo stars`]}
      placeholder="Sort by..."
      maxSelect={1}
      bind:selected={$sortBy}
      --sms-max-width="14em"
    />
    {#if $sortBy?.length > 0}
      <RadioButtons
        selected="desc"
        on:change={() => dispatch(`toggle-sort`)}
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
