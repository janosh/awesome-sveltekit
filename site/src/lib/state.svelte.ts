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

export const sorted = $state<{
  by: string[]
  order: `asc` | `desc`
  sites: Site[]
}>({ by: [`GitHub repo stars`], order: `desc`, sites: [] })
