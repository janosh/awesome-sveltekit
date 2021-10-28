<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let options: Option[]
  export let selected: Option | undefined = undefined

  type Option = string | number

  const dispatch = createEventDispatcher()
  const handler = (value: Option) => () => dispatch(`change`, { value })
</script>

<div>
  {#each options as value}
    <label>
      <input type="radio" bind:group={selected} {value} on:change={handler(value)} />
      <span>{value}</span></label>
  {/each}
</div>

<style>
  div {
    display: flex;
    border-radius: 3pt;
    max-width: max-content;
    overflow: hidden;
    height: fit-content;
  }
  input {
    display: none;
  }
  span {
    cursor: pointer;
    display: inline-block;
    color: white;
    padding: 2pt 1ex;
    background: black;
    transition: 0.3s;
  }
  input:not(:checked) + span:hover {
    background: cornflowerblue;
    transform: scale(1.01);
  }
  input:checked + span {
    box-shadow: inset 0 0 1em -3pt black;
    background: darkcyan;
  }
</style>
