<script lang="ts">
  import { Icon } from 'svelte-widgets'
  import { ExternalLink, GitHub, Twitter } from 'svelte-widgets/icons'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { SiteAuthor } from './index'

  let { person, ...rest }: { person: SiteAuthor } & HTMLAttributes<HTMLSpanElement> =
    $props()
  let { name, twitter, github, url, avatar } = $derived(person)
</script>

<span {...rest}>
  {#if avatar}
    <img src="{avatar}&size=100" alt={name} />
  {/if}
  {name}
  {#if twitter}<a href="https://twitter.com/{twitter.replace(/^@/, ``)}"
      ><Icon icon={Twitter} /></a
    >{/if}
  {#if github}<a href="https://github.com/{github}"><Icon icon={GitHub} /></a>{/if}
  {#if url}<a href={url}><Icon icon={ExternalLink} /></a>{/if}
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
