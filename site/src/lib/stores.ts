import { writable } from 'svelte/store'
import { session_store } from 'svelte-zoo'
import type { Site } from '.'

export const sort_by = session_store<string[]>(`sort_by`, [`GitHub repo stars`])

export const search = session_store<string>(`search`, ``)

export const tag_filter_mode = session_store<`all` | `any`>(
  `tag-filter-mode`,
  `any`,
)
export const contributor_filter_mode = session_store<`all` | `any`>(
  `contributor-filter-mode`,
  `any`,
)

tag_filter_mode.subscribe((mode) => {
  if ([`all`, `any`].includes(mode)) return mode
})

contributor_filter_mode.subscribe((mode) => {
  if ([`all`, `any`].includes(mode)) return mode
})

export const filter_tags = session_store<
  { label: string; value: string; count: number }[]
>(`filter-tags`, [])

export const filter_contributors = session_store<
  { label: string; value: string; count: number }[]
>(`filter-contributors`, [])

export const sorted_sites = writable<Site[]>([])
