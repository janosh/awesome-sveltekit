<script lang="ts">
  import Twitter from '~icons/fa-brands/twitter'
  import LinkExternal from '~icons/octicon/link-external'
  import MarkGithub from '~icons/octicon/mark-github'
  import { Contributor } from '../types'

  export let contributor: Contributor
</script>

<span>
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
</span>

<style>
  a {
    margin-left: 5pt;
    vertical-align: -2pt;
  }
</style>
