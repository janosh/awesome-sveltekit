<script lang="ts">
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'
  import { SiteDetails, SitePreview } from '#lib'
  import { repository } from '#site/package.json'
  import { Icon, PrevNext } from 'svelte-widgets'
  import { PullRequest, Sunglasses } from 'svelte-widgets/icons'
  import { is_editable_event_target, is_modifier_chord } from 'svelte-widgets/utils'

  let { data } = $props()

  let head_title = $derived(`${data.site.title} | Awesome SvelteKit`)
  let plain_description = $derived(data.site.description?.replaceAll(/<[^>]*>/gu, ``))

  // PrevNext only renders links, so arrow-key navigation (wrapping at the ends) lives here
  function handle_keyup(event: KeyboardEvent) {
    if (is_modifier_chord(event) || is_editable_event_target(event.target)) return
    const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key]
    const { sites, slug } = data
    if (step === undefined || sites.length < 2) return
    const idx = sites.findIndex((site) => site.slug === slug)
    const target = sites[(idx + step + sites.length) % sites.length]
    goto(resolve(`/[slug]`, { slug: target.slug }))
  }
</script>

<svelte:window onkeyup={handle_keyup} />

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
  items={data.sites.map((site) => ({ href: site.slug, label: site.title, site }))}
  current={data.slug}
  style="max-width: var(--main-max-width)"
>
  {#snippet children({ item, kind })}
    <div style="max-width: 250px">
      <h3 style:text-align={kind === `next` ? `right` : `left`}>
        <a href={item.href}>
          {@html kind === `next` ? `Next &rarr;` : `&larr; Previous`}
        </a>
      </h3>
      <SitePreview site={item.site} />
    </div>
  {/snippet}
</PrevNext>

<footer>
  Have a site you'd like to add to this <Icon icon={Sunglasses} /> collection?
  <a href="{repository}/edit/main/sites.yml">
    <Icon icon={PullRequest} />
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
    transition:
      color 0.3s,
      background-color 0.3s;
  }
  a.back:hover {
    background: rgba(255, 255, 255, 0.4);
  }
  footer {
    text-align: center;
    margin: 6em 0 2em;
    color: white;
    :global(svg) {
      margin-inline: 2pt;
    }
  }
</style>
