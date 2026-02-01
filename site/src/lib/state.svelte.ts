import type { Site } from './index'

export const filters = $state<{
  search: string
  tags: { label: string; value: string; count: number }[]
  contributors: { label: string; value: string; count: number }[]
  contributors_mode: `all` | `any`
  tags_mode: `all` | `any`
}>({
  search: ``,
  tags: [],
  contributors: [],
  contributors_mode: `any`,
  tags_mode: `any`,
})

export const sort_by = { date: `Date Created`, stars: `GitHub Stars` } as const
export type SortBy = keyof typeof sort_by
export const sorted = $state<
  { by: SortBy; order: `asc` | `desc`; sites: Site[] }
>({ by: `GitHub Stars`, order: `desc`, sites: [] })
