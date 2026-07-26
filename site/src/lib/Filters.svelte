<script lang="ts">
  import { ButtonGroup, MultiSelect, type ObjectOption } from 'svelte-widgets'
  import { filter_modes, filters, sort_by, sorted } from './state.svelte'

  let {
    tags,
    contributors,
  }: { tags: [string, number][]; contributors: [string, number][] } = $props()
</script>

{#snippet option({ option }: { option: ObjectOption })}
  <span style="display: flex">
    {option.label} <span style="flex: 1"></span>
    {option.count}
  </span>
{/snippet}

<div class="filters">
  <input type="search" bind:value={filters.search} placeholder="Search..." />
  <div class="filter-group">
    <MultiSelect
      options={tags.map(([label, count]) => ({ label, count }))}
      placeholder="Filter by tag..."
      bind:selected={filters.tags}
      {option}
    />
    {#if filters.tags.length > 1}
      <ButtonGroup
        bind:selected={filters.tags_mode}
        options={filter_modes}
        label="Tag match mode"
      />
    {/if}
  </div>
  <div class="filter-group">
    <MultiSelect
      options={contributors.map(([label, count]) => ({ label, count }))}
      placeholder="Filter by contributor..."
      bind:selected={filters.contributors}
      {option}
    />
    {#if filters.contributors.length > 1}
      <ButtonGroup
        bind:selected={filters.contributors_mode}
        options={filter_modes}
        label="Contributor match mode"
      />
    {/if}
  </div>
  <ButtonGroup
    bind:selected={sorted.by}
    bind:sort_order={sorted.order}
    options={sort_by}
    label="Sort by"
  />
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
    margin: 2em auto;
    --sms-bg: black;
    --sms-max-width: 22em;
    --sms-selected-bg: rgba(255, 255, 255, 0.15);
    --sms-options-bg: #2e2935;
    --sms-border: 1px solid #333;
    --sms-options-border: var(--sms-border);
    --sms-li-active-bg: rgba(255, 255, 255, 0.15);
    --sms-placeholder-color: gray;
    --btn-group-gap: 0;
    --btn-group-bg: black;
    --btn-group-border: 1px solid #333;
    --btn-group-radius: 3pt;
    --btn-group-padding: 1px;
    --btn-group-btn-radius: 2pt;
    --btn-group-btn-color: #999;
    --btn-group-btn-font-size: 0.875em;
    --btn-group-btn-hover-bg: transparent;
    --btn-group-btn-hover-color: #eee;
    --btn-group-btn-active-bg: rgba(255, 255, 255, 0.15);
    --btn-group-btn-active-color: #eee;
  }
  div.filters :global(.button-group) {
    font-weight: 500;
  }
  .filter-group {
    gap: 4pt;
  }
  input[type='search'] {
    border: 1px solid #333;
    outline: none;
    padding: 3pt 1ex;
    border-radius: 3pt;
    color: inherit;
    background: black;
    font-size: 1em;
    &::placeholder {
      color: gray;
    }
    &::-webkit-search-cancel-button {
      padding: 2pt;
      cursor: pointer;
    }
  }
</style>
