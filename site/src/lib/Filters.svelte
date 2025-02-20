<script lang="ts">
  import MultiSelect from 'svelte-multiselect'
  import { RadioButtons } from 'svelte-zoo'
  import {
    contributor_filter_mode,
    filter_contributors,
    filter_tags,
    search,
    sort_by,
    tag_filter_mode,
  } from './stores'

  interface Props {
    tags: [string, number][]
    contributors: [string, number][]
    sort_order?: `asc` | `desc`
  }

  let { tags, contributors, sort_order = $bindable(`desc`) }: Props = $props()
</script>

<div class="filters">
  <input type="search" bind:value={$search} placeholder="Search..." />
  <div>
    <MultiSelect
      options={tags.map(([label, count]) => ({ label, count }))}
      placeholder="Filter by tag..."
      bind:selected={$filter_tags}
    >
      {#snippet option({ option })}
        <span style="display: flex;">
          {option.label} <span style="flex: 1;"></span>
          {option.count}
        </span>
      {/snippet}
    </MultiSelect>
    {#if $filter_tags.length > 1}
      <RadioButtons bind:selected={$tag_filter_mode} options={[`all`, `any`]} />
    {/if}
  </div>
  <div>
    <MultiSelect
      options={contributors.map(([label, count]) => ({ label, count }))}
      placeholder="Filter by contributor..."
      bind:selected={$filter_contributors}
    >
      {#snippet option({ option })}
        <span style="display: flex;">
          {option.label} <span style="flex: 1;"></span>
          {option.count}
        </span>
      {/snippet}
    </MultiSelect>
    {#if $filter_contributors.length > 1}
      <RadioButtons bind:selected={$contributor_filter_mode} options={[`all`, `any`]} />
    {/if}
  </div>
  <div>
    <MultiSelect
      options={[`Date created`, `GitHub repo stars`]}
      placeholder="Sort by..."
      maxSelect={1}
      bind:selected={$sort_by}
    />
    {#if $sort_by?.length > 0}
      <RadioButtons bind:selected={sort_order} options={[`asc`, `desc`]} />
    {/if}
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
  input[type='search']::-webkit-search-cancel-button {
    padding: 2pt;
    cursor: pointer;
  }
</style>
