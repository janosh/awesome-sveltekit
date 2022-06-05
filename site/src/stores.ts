import { writable } from 'svelte/store'

function session_store<T>(name: string, initialValue: T) {
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

export const sort_by = session_store<string[]>(`sort_by`, [`GitHub repo stars`])

export const search = session_store<string>(`search`, ``)

export const tag_filter_mode = session_store<`and` | `or`>(
  `tag-filter-mode`,
  `or`
)
export const contributor_filter_mode = session_store<`and` | `or`>(
  `contributor-filter-mode`,
  `or`
)

tag_filter_mode.subscribe((mode) => {
  if ([`and`, `or`].includes(mode)) return mode
})

contributor_filter_mode.subscribe((mode) => {
  if ([`and`, `or`].includes(mode)) return mode
})

export const filter_tags = session_store<
  { label: string; value: string; count: number }[]
>(`filter-tags`, [])

export const filter_contributors = session_store<
  { label: string; value: string; count: number }[]
>(`filter-contributors`, [])
