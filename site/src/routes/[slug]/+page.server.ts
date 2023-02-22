import { sorted_sites } from '$lib/stores'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'
import type { PageServerLoad } from './$types'

const pretty_date = (date = ``): string =>
  new Date(date).toLocaleString(`en`, {
    month: `short`,
    year: `numeric`,
    day: `numeric`,
  })

export const load: PageServerLoad = ({ params }) => {
  const { slug } = params

  const sites = get(sorted_sites)

  const idx = sites.findIndex((site) => site.slug === slug)

  if (idx === -1) {
    throw error(404, `Page '${slug}' not found`)
  }
  // wrap around start/end of array
  const prev_idx = (idx - 1 + sites.length) % sites.length
  const next_idx = (idx + 1) % sites.length

  const prev = sites[prev_idx]
  const next = sites[next_idx]
  const site = sites[idx]

  for (const itm of [prev, next, site]) {
    for (const [key, val] of Object.entries(itm)) {
      if (val instanceof Date) {
        itm[key] = pretty_date(val)
      }
    }
  }

  return { site, prev, next }
}
