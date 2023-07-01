<script lang="ts">
  import { SiteDetails, SitePreview } from '$lib'
  import { repository } from '$site/package.json'
  import Icon from '@iconify/svelte'
  import { PrevNext } from 'svelte-zoo'

  export let data

  $: head_title = `${data.site.title} | Awesome SvelteKit`
  $: plain_description = data.site?.description?.replace(/<[^>]*>/g, ``)
</script>

<svelte:head>
  <title>{head_title}</title>
  <meta property="og:title" content={head_title} />
  {#if plain_description}
    <meta name="description" content={plain_description} />
    <meta property="og:description" content={plain_description} />
  {/if}
  {#if data.site.contributors?.[0]?.twitter}
    <meta name="twitter:creator" content={data.site.contributors[0].twitter} />
  {/if}
</svelte:head>

<a href="." class="back">&laquo; home</a>

<main>
  <SiteDetails site={data.site} />
</main>
<PrevNext
  items={data.sites?.map((site) => [site.slug, site])}
  current={data.slug}
  style="max-width: var(--main-max-width);"
  let:item
  let:kind
>
  <div style="max-width: 250px;">
    <h3 style="text-align: {kind == `next` && `right`}">
      <a href={item.slug}>
        {@html kind == `next` ? `Next &rarr;` : `&larr; Previous`}
      </a>
    </h3>
    <SitePreview site={item} />
  </div>
</PrevNext>

<footer>
  Have a site you'd like to add to this
  <Icon icon="mdi:sunglasses" inline style="margin: 0 2pt;" />
  collection?
  <a href="{repository}/edit/main/sites.yml">
    <Icon icon="octicon:git-pull-request" inline style="margin: 0 2pt 0 4pt;" />
    PRs welcome!
  </a>

  <p>
    <small>
      Use arrow keys &thinsp;&larr; &rarr;&thinsp; to navigate between sites.
    </small>
  </p>
</footer>

<style>
  main {
    display: flex;
    gap: 2em;
    margin: 6em auto 2em;
    min-height: 40vh;
  }
  :global(main > *) {
    flex: 1;
  }
  @media (max-width: 750px) {
    main {
      flex-direction: column-reverse;
      gap: 1em;
    }
  }
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
  footer {
    text-align: center;
    margin: 6em 0 2em;
    color: white;
  }
</style>
