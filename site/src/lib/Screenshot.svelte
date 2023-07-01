<script lang="ts">
  import { dev } from '$app/environment'

  export let title: string
  // width/height used only for aspect ratio to avoid content shift on img load
  export let width = 800
  export let height = 600
  export let style = ``
  export let resolution: '.small' | '' = ``

  const titleToSlug = (title: string) => title.toLowerCase().replaceAll(` `, `-`)

  const base = `https://raw.githubusercontent.com/janosh/awesome-sveltekit/main/site/static`
  $: src = `${dev ? `` : base}/screenshots/${titleToSlug(title)}${resolution}.avif`
</script>

<img {src} alt="Screenshot of {title}" {width} {height} {style} />

<style>
  img {
    width: 100%;
    height: auto;
    border-radius: 2pt;
  }
</style>
