<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'

  import { preventOverScroll } from '../actions'

  export let style: string
  export let showCloseBtn = false

  const dispatch = createEventDispatcher()
  const close = () => dispatch(`close`)

  let modal: HTMLDivElement
  let origScrollPos: [number, number]
  let origActiveElement: HTMLElement | null

  // record original scroll position and focused element
  // to return to when modal closes (see onDestroy)
  onMount(() => {
    origScrollPos = [window.scrollX, window.scrollY]
    origActiveElement = document.activeElement as HTMLElement
  })

  onDestroy(() => {
    if (origActiveElement) origActiveElement.focus()
    window.scrollTo(...origScrollPos)
  })

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === `Escape`) return close()

    if (event.key === `Tab`) {
      // trap focus inside the modal
      const nodes = modal.querySelectorAll<HTMLElement>(`*`) // get all the modal's child nodes
      const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0)

      const activeEl = document?.activeElement
      if (activeEl) {
        let index = tabbable.indexOf(activeEl as HTMLElement)
        if (index === -1 && event.shiftKey) index = 0

        index += tabbable.length + (event.shiftKey ? -1 : 1)
        index %= tabbable.length

        tabbable[index].focus()
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal-background" on:click|self={close}>
  <div
    use:preventOverScroll
    class="modal"
    role="dialog"
    aria-modal="true"
    bind:this={modal}
    {style}>
    {#if showCloseBtn}<button on:click={close}><span>&times;</span></button>{/if}
    <slot />
  </div>
</div>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: grid;
  }
  .modal {
    position: absolute;
    place-self: center;
    width: calc(100vw - 8em);
    max-width: 40em;
    max-height: calc(100vh - 8em);
    overflow: auto;
    padding: 0 1em;
    border-radius: 5pt;
    background: rgba(0, 0, 0, 0.6);
  }
  button {
    position: absolute;
    top: 0;
    right: 0;
    background: teal;
    border-radius: 50%;
    color: white;
  }
  button span {
    transform: scale(3);
    display: block;
  }
</style>
