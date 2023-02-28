<script lang="ts">
  import Icon from '@iconify/svelte'
  import type { Contributor } from '.'

  export let person: Contributor

  $: ({ name, twitter, github, url, avatar } = person)
</script>

<span>
  <!-- show github profile photo -->
  {#if avatar}
    <img src="{avatar}&size=100" alt={name} />
  {/if}
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
  img {
    width: 4ex;
    height: 4ex;
    border-radius: 50%;
    margin: 5pt;
    vertical-align: middle;
  }
</style>
