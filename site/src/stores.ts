import { writable } from 'svelte/store'

export const sortByOptions = [
  ``,
  `Date created`,
  `Date last updated`,
  `GitHub repo stars`,
] as const

export const sortBy = writable<typeof sortByOptions[number]>(``)

export const filterTags = writable<string[]>([])
