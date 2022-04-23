<script lang="ts">
  import Twitter from '~icons/fa-brands/twitter'
  import LinkExternal from '~icons/octicon/link-external'
  import MarkGithub from '~icons/octicon/mark-github'
  import { Contributor } from '../types'

  export let contributor: Contributor

  $: ({ name, twitter, github, url } = contributor)
</script>

<span>
  {name ?? github}
  {#if twitter}
    <a href="https://twitter.com/@{twitter}">
      <Twitter />
    </a>
  {/if}
  {#if github}
    <a href="https://github.com/{github}">
      <MarkGithub />
    </a>
  {/if}
  {#if url}
    <a href={url}>
      <LinkExternal />
    </a>
  {/if}
</span>

<style>
  a {
    margin-left: 5pt;
    vertical-align: -2pt;
  }
</style>
