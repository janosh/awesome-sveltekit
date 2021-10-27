<script lang="ts">
  export let title: string
  export let width = 800
  export let height = 600
  export let style = ``

  const src = `/screenshots/${title.toLowerCase().replaceAll(` `, `-`)}.webp`
</script>

<img {src} alt="Screenshot of {title}" {width} {height} on:click {style} />

<style>
  img {
    width: 100%;
    height: auto;
  }
</style>
