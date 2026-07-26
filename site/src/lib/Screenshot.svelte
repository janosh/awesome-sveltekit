<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  let {
    title,
    // Width/height used only for aspect ratio to avoid content shift on img load
    width = 800,
    height = 600,
    resolution = ``,
    ...rest
  }: {
    title: string
    width?: number
    height?: number
    resolution?: `.small` | ``
  } & HTMLAttributes<HTMLImageElement> = $props()

  let src = $derived(
    `/screenshots/${title.toLowerCase().replaceAll(` `, `-`)}${resolution}.avif`,
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
