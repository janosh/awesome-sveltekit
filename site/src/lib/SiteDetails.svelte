<script lang="ts">
  import { CopyButton, Icon } from 'svelte-widgets'
  import { Account, GitHub, NPM, Project, Stack, Star, Tag } from 'svelte-widgets/icons'
  import uses_links from '$root/tools.yml'
  import { tooltip } from 'svelte-widgets/attachments'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Site } from './index'
  import Person from './Person.svelte'
  import Screenshot from './Screenshot.svelte'

  let {
    site,
    ...rest
  }: HTMLAttributes<HTMLElementTagNameMap[`section`]> & {
    site: Site
  } = $props()
  let { title, url, tags, uses, contributors, date_created, repo_stars, repo, npm } =
    $derived(site)

  let days_since_created = $derived(
    Math.floor((Date.now() - Date.parse(date_created)) / 86_400_000),
  )
  let contrib_url = $derived(repo ? `${repo}/contributors` : undefined)

  let tools = $derived(
    uses.flatMap((tool) => {
      const href = uses_links[tool.toLowerCase()]
      if (!href) {
        console.error(`Unknown tool: ${tool}`)
        return []
      }
      if (!href.startsWith(`https`)) {
        throw new Error(`All tool URLs should use HTTPS: ${tool} has href: ${href}`)
      }
      return [[tool, href]]
    }),
  )
</script>

<section {...rest}>
  <h1>
    <a href={url}>{title}</a>
    <small {@attach tooltip()}>
      {#if repo}
        <span>
          <a href={repo}><Icon icon={GitHub} /></a>
          <CopyButton content={repo} aria-label={`Copy repo URL`} />
        </span>
      {/if}
      {#if npm}
        <span>
          <a href={npm}><Icon icon={NPM} height="2.5ex" /></a>
          <CopyButton content={npm} aria-label={`Copy npm URL`} />
        </span>
      {/if}
    </small>
  </h1>

  {#if site.description}
    <p>{@html site.description}</p>
  {/if}

  <dl>
    {#if repo && repo_stars}
      <dt><Icon icon={Star} />Stars</dt>
      <dd><a href={repo}>{repo_stars.toLocaleString()}</a></dd>
    {/if}
    {#if contributors?.length}
      <dt>
        <Icon icon={Account} />
        <svelte:element this={contrib_url ? `a` : `span`} href={contrib_url}>
          {contributors.length > 1 ? `Contributors` : `Creator`}
        </svelte:element>
      </dt>
      <dd>
        {#if contributors.length > 1}
          <ol>
            {#each contributors as person (person.name)}
              <li><Person {person} /></li>
            {/each}
          </ol>
        {:else}
          <Person person={contributors[0]} />
        {/if}
      </dd>
    {/if}
    {#if date_created}
      <dt><Icon icon={Project} />Project started on</dt>
      <dd>
        <svelte:element
          this={repo ? `a` : `span`}
          href={repo}
          title="{days_since_created} days ago"
          {@attach tooltip()}
        >
          {date_created}
        </svelte:element>
      </dd>
    {/if}
    {#if tags.length > 0}
      <dt><Icon icon={Tag} />Tags</dt>
      <dd class="chips">
        {#each tags as tag (tag)}
          <span>{tag}</span>
        {/each}
      </dd>
    {/if}
    {#if tools.length > 0}
      <dt><Icon icon={Stack} />Uses</dt>
      <dd class="chips">
        {#each tools as [tool, href] (tool)}
          <a {href}>{tool}</a>
        {/each}
      </dd>
    {/if}
  </dl>
</section>
<aside>
  <Screenshot {title} />
</aside>

<style>
  h1 {
    display: flex;
    gap: 1em;
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
  }
  h1 small {
    font-size: 14pt;
    display: flex;
    gap: 10pt;
    place-items: center;
    > span {
      display: flex;
      align-items: center;
      gap: 4pt;
    }
    a {
      color: white;
    }
    :global([data-sms-copy]) {
      color: white;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      font: inherit;
    }
    :global([data-sms-copy]:hover) {
      color: orange;
    }
  }
  /* two columns so labels and values each line up, however the values wrap */
  dl {
    display: grid;
    grid-template-columns: auto 1fr;
  }
  :is(dt, dd) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6pt;
    margin: 0;
    padding: 8pt 0;
    border-top: 0.5px solid lightblue;
  }
  dt {
    padding-right: 1em;
  }
  dd {
    justify-content: end;
  }
  dd ol {
    margin: 0;
    line-height: 1.6em;
  }
  dd.chips > * {
    background-color: rgba(255, 255, 255, 0.1);
    line-height: 1.2em;
    padding: 1pt 3pt;
    border-radius: 3pt;
  }
  @media (max-width: 750px) {
    aside {
      max-width: 500px;
      margin: auto;
    }
  }
</style>
