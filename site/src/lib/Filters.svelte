<script lang="ts">
  import MultiSelect from 'svelte-multiselect'
  import { filters, sort_by, sorted } from './state.svelte'
  import ToggleGroup from './ToggleGroup.svelte'

  let { tags, contributors, sort_order = $bindable(`desc`) }: {
    tags: [string, number][]
    contributors: [string, number][]
    sort_order?: `asc` | `desc`
  } = $props()
</script>

<div class="filters">
  <input type="search" bind:value={filters.search} placeholder="Search..." />
  <div class="filter-group">
    <MultiSelect
      options={tags.map(([label, count]) => ({ label, count }))}
      placeholder="Filter by tag..."
      bind:selected={filters.tags}
    >
      {#snippet option({ option }: { option: { label: string; count: number } })}
        <span style="display: flex">
          {option.label} <span style="flex: 1"></span> {option.count}
        </span>
      {/snippet}
    </MultiSelect>
    {#if filters.tags.length > 1}
      <ToggleGroup bind:value={filters.tags_mode} options={[`all`, `any`]} />
    {/if}
  </div>
  <div class="filter-group">
    <MultiSelect
      options={contributors.map(([label, count]) => ({ label, count }))}
      placeholder="Filter by contributor..."
      bind:selected={filters.contributors}
    >
      {#snippet option({ option }: { option: { label: string; count: number } })}
        <span style="display: flex">
          {option.label} <span style="flex: 1"></span> {option.count}
        </span>
      {/snippet}
    </MultiSelect>
    {#if filters.contributors.length > 1}
      <ToggleGroup bind:value={filters.contributors_mode} options={[`all`, `any`]} />
    {/if}
  </div>
  <div class="filter-group">
    <ToggleGroup bind:value={sorted.by} options={Object.values(sort_by)} />
    <ToggleGroup bind:value={sort_order} options={[`asc`, `desc`]} />
  </div>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    gap: 1em;
    flex-wrap: wrap;
    place-content: center;
  }
  div.filters {
    place-content: center;
    flex-wrap: wrap;
    margin: 2em auto;
  }
  .filter-group {
    gap: 4pt;
  }
  input[type='search']::-webkit-search-cancel-button {
    padding: 2pt;
    cursor: pointer;
  }
</style>
