import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'
import { sorted_sites } from '../../stores'
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

  const site_idx = sites.findIndex((site) => site.slug === slug)

  if (site_idx === -1) {
    throw error(404, `Page '${slug}' not found`)
  }
  // wrap around start/end of array
  const prev_idx = (site_idx - 1 + sites.length) % sites.length
  const next_idx = (site_idx + 1) % sites.length

  const prev_site = sites[prev_idx]
  const next_site = sites[next_idx]
  const site = sites[site_idx]

  for (const itm of [prev_site, next_site, site]) {
    for (const [key, val] of Object.entries(itm)) {
      if (val instanceof Date) {
        itm[key] = pretty_date(val)
      }
    }
  }

  return { prev_site, site, next_site }
}
