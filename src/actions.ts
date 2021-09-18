export function preventOverScroll(node: HTMLElement): { destroy(): void } {
  const preventScroll = (event: Event) => {
    const scrollable =
      node.scrollWidth > node.clientWidth ||
      node.scrollHeight > node.clientHeight

    if (!scrollable) event.preventDefault()
  }

  node.addEventListener(`mousewheel`, preventScroll, { passive: false })
  return {
    destroy: () => node.removeEventListener(`mousewheel`, preventScroll),
  }
}
