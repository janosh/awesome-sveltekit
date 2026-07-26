<script lang="ts">
  import { Icon } from 'svelte-widgets'
  import { Star, Tag } from 'svelte-widgets/icons'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Site } from './index'
  import Screenshot from './Screenshot.svelte'
  import { filters } from './state.svelte'

  let {
    site,
    idx = 0,
    tags = false,
    ...rest
  }: HTMLAttributes<HTMLAnchorElement> & {
    site: Site
    idx?: number
    tags?: boolean
  } = $props()
</script>

<a href={site.slug} {...rest}>
  <Screenshot title={site.title} resolution=".small" style="cursor: pointer" />
</a>
<div class="flex">
  <span>
    {idx > 0 ? `${idx}. ` : ``}<a href={site.url}>{site.title}</a>
  </span>
  {#if site.repo_stars}
    <small class="flex">
      <Icon icon={Star} />
      {site.repo_stars.toLocaleString()}
    </small>
  {/if}
</div>
{#if tags}
  <p class="tags flex">
    <Icon icon={Tag} />
    {#each site.tags as tag (tag)}
      <small class:active={filters.tags.some((filter_tag) => filter_tag.label === tag)}>
        {tag}
      </small>
    {/each}
  </p>
{/if}

<style>
  .flex {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1ex;
    &:where(div) {
      margin-top: 6pt;
      justify-content: space-between;
    }
  }
  p.tags small {
    background-color: rgba(255, 255, 255, 0.2);
    line-height: 1.2em;
    padding: 1pt 3pt;
    margin: 3pt 0;
    border-radius: 3pt;
    font-size: 9pt;
  }
  p.tags small.active {
    font-weight: bold;
  }
</style>
