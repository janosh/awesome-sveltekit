<script lang="ts">
  import { dev } from '$app/environment'

  interface Props {
    title: string
    // width/height used only for aspect ratio to avoid content shift on img load
    width?: number
    height?: number
    style?: string
    resolution?: `.small` | ``
  }

  let { title, width = 800, height = 600, style = ``, resolution = `` }: Props = $props()

  const slugify = (title: string) => title.toLowerCase().replaceAll(` `, `-`)

  const base = `https://raw.githubusercontent.com/janosh/awesome-sveltekit/main/site/static`
  let src = $derived(`${dev ? `` : base}/screenshots/${slugify(title)}${resolution}.avif`)
</script>

<img {src} alt="Screenshot of {title}" {width} {height} {style} />

<style>
  img {
    width: 100%;
    height: auto;
    border-radius: 2pt;
  }
</style>
