<script lang="ts">
  import Twitter from '@svicons/fa-brands/twitter.svelte'
  import LinkExternal from '@svicons/octicons/link-external.svelte'
  import MarkGithub from '@svicons/octicons/mark-github.svelte'
  import { Creator } from '../types'

  export let creator: Creator
</script>

{creator.name}
{#if creator.twitter}
  <a href="https://twitter.com/@{creator.twitter}">
    <Twitter width="1em" />
  </a>
{/if}
{#if creator.github}
  <a href="https://github.com/{creator.github}">
    <MarkGithub width="1em" />
  </a>
{/if}
{#if creator.url}
  <a href={creator.url}>
    <LinkExternal width="1em" />
  </a>
{/if}

<style>
  a {
    margin-left: 3pt;
    vertical-align: -2pt;
  }
</style>
