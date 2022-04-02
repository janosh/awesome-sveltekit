import { writable } from 'svelte/store'

function sessionStore<T>(name: string, initialValue: T) {
  if (typeof sessionStorage !== `undefined` && sessionStorage[name]) {
    initialValue = JSON.parse(sessionStorage[name])
  }

  const { subscribe, set } = writable(initialValue)

  return {
    subscribe,
    set: (val: T) => {
      if (val !== undefined && typeof sessionStorage !== `undefined`) {
        sessionStorage[name] = JSON.stringify(val)
      }
      set(val)
    },
  }
}

export const sortBy = sessionStore<{ label: string; value: string }[]>(
  `sortBy`,
  []
)

export const search = sessionStore<string>(`search`, ``)

export const tagFilterMode = sessionStore<`and` | `or`>(`tag-filter-mode`, `or`)

tagFilterMode.subscribe((mode) => {
  if ([`and`, `or`].includes(mode)) return mode
})

export const filterTags = sessionStore<
  { label: string; value: string; count: number }[]
>(`filter-tags`, [])
