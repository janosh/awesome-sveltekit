<script lang="ts">
  import { dev } from '$app/environment'
  import type { HTMLAttributes } from 'svelte/elements'

  let { title, width = 800, height = 600, resolution = ``, ...rest }: {
    title: string
    // width/height used only for aspect ratio to avoid content shift on img load
    width?: number
    height?: number
    style?: string
    resolution?: `.small` | ``
  } & HTMLAttributes<HTMLImageElement> = $props()

  const slugify = (title: string) => title.toLowerCase().replaceAll(` `, `-`)

  const base_url = `https://github.com/janosh/awesome-sveltekit/raw/main/site/static`
  let src = $derived(
    `${dev ? `` : base_url}/screenshots/${slugify(title)}${resolution}.avif`,
  )
</script>

<img {src} alt="Screenshot of {title}" {width} {height} {...rest} />

<style>
  img {
    width: 100%;
    height: auto;
    border-radius: 2pt;
  }
</style>
