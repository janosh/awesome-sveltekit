<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Site } from './index'

  let {
    site,
    // Width/height used only for aspect ratio to avoid content shift on img load
    width = 800,
    height = 600,
    resolution = ``,
    ...rest
  }: {
    site: Site
    width?: number
    height?: number
    resolution?: `.small` | ``
  } & HTMLAttributes<HTMLImageElement> = $props()

  let src = $derived(`/screenshots/${site.slug}${resolution}.avif`)
</script>

<img {src} alt="Screenshot of {site.title}" {width} {height} {...rest} />

<style>
  img {
    width: 100%;
    height: auto;
    border-radius: 2pt;
  }
</style>
