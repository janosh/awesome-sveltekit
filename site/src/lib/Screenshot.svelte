<script lang="ts">
  import { dev } from '$app/environment'
  import type { HTMLAttributes } from 'svelte/elements'

  let {
    title,
    width = 800,
    height = 600,
    resolution = ``,
    ...rest
  }: {
    title: string
    // Width/height used only for aspect ratio to avoid content shift on img load
    width?: number
    height?: number
    style?: string
    resolution?: `.small` | ``
  } & HTMLAttributes<HTMLImageElement> = $props()

  const slugify = (site_title: string) => site_title.toLowerCase().replaceAll(` `, `-`)

  const raw_url = `https://github.com/janosh/awesome-sveltekit/raw/main/site/static/screenshots`
  const base_url = dev ? `` : raw_url
  let src = $derived(`${base_url}/screenshots/${slugify(title)}${resolution}.avif`)
</script>

<img {src} alt="Screenshot of {title}" {width} {height} {...rest} />

<style>
  img {
    width: 100%;
    height: auto;
    border-radius: 2pt;
  }
</style>
