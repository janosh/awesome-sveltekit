<script lang="ts">
  import SiteDetails from '../components/SiteDetails.svelte'
  import { Site } from '../types'

  export let site: Site

  $: head_title = `${site.title} | Awesome SvelteKit`
  $: plain_description = site?.description?.replace(/<[^>]*>/g, ``)
</script>

<svelte:head>
  <title>{head_title}</title>
  <meta property="og:title" content={head_title} />
  {#if plain_description}
    <meta name="description" content={plain_description} />
    <meta property="og:description" content={plain_description} />
  {/if}
  {#if site.contributors[0]?.twitter}
    <meta name="twitter:creator" content={site.contributors[0].twitter} />
  {/if}
</svelte:head>

<a href="/" class="back" sveltekit:prefetch>&laquo; back</a>
<SiteDetails {site} />

<style>
  a.back {
    background: rgba(255, 255, 255, 0.2);
    padding: 4pt 1ex;
    border-radius: 4pt;
    margin: 2pt;
    font-size: 16pt;
    position: absolute;
    top: 2em;
    left: 2em;
    transition: color 0.3s, background-color 0.3s;
  }
  a.back:hover {
    background: rgba(255, 255, 255, 0.4);
  }
</style>
