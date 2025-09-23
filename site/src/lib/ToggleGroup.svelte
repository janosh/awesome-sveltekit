<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  let { value = $bindable(), options, ...rest }: HTMLAttributes<HTMLDivElement> & {
    value: string
    options: string[]
  } = $props()
</script>

<div {...rest}>
  {#each options as opt (opt)}
    <button type="button" class:active={value === opt} onclick={() => (value = opt)}>
      {opt}
    </button>
  {/each}
</div>

<style>
  div {
    display: inline-flex;
    gap: 0;
    background: black;
    border: 1px solid #333;
    border-radius: 3pt;
    padding: 1px;
  }
  button {
    padding: 2pt 6pt;
    border: none;
    background: transparent;
    color: #999;
    cursor: pointer;
    border-radius: 2pt;
    font-size: 0.875em;
    transition: all 0.15s ease;
    font-weight: 500;
  }
  button:hover {
    color: #eee;
  }
  button.active {
    background: rgba(255, 255, 255, 0.15);
    color: #eee;
  }
</style>
