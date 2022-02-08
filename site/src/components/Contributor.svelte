<script lang="ts">
  import Twitter from '@svicons/fa-brands/twitter.svelte'
  import LinkExternal from '@svicons/octicons/link-external.svelte'
  import MarkGithub from '@svicons/octicons/mark-github.svelte'
  import { Contributor } from '../types'

  export let contributor: Contributor
</script>

{contributor.name}
{#if contributor.twitter}
  <a href="https://twitter.com/@{contributor.twitter}">
    <Twitter width="1em" />
  </a>
{/if}
{#if contributor.github}
  <a href="https://github.com/{contributor.github}">
    <MarkGithub width="1em" />
  </a>
{/if}
{#if contributor.url}
  <a href={contributor.url}>
    <LinkExternal width="1em" />
  </a>
{/if}

<style>
  a {
    margin-left: 3pt;
    vertical-align: -2pt;
  }
</style>
