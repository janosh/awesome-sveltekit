<script lang="ts">
  import Icon from '@iconify/svelte'
  import type { Contributor } from './types'

  export let contributor: Contributor

  $: ({ name, twitter, github, url } = contributor)
</script>

<span>
  {name ?? github}
  {#if twitter}
    <a href="https://twitter.com/@{twitter}">
      <Icon icon="fa-brands:twitter" inline />
    </a>
  {/if}
  {#if github}
    <a href="https://github.com/{github}">
      <Icon icon="octicon:mark-github" inline />
    </a>
  {/if}
  {#if url}
    <a href={url}>
      <Icon icon="octicon:link-external" inline />
    </a>
  {/if}
</span>

<style>
  a {
    margin-left: 5pt;
    vertical-align: -2pt;
  }
</style>
