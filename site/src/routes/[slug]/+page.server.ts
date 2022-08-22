import { error } from '@sveltejs/kit'
import sites from '../../sites.yml'
import type { PageServerLoad } from './$types'

const pretty_date = (date = ``): string =>
  new Date(date).toLocaleString(`en`, {
    month: `short`,
    year: `numeric`,
    day: `numeric`,
  })

export const load: PageServerLoad = ({ params }) => {
  const site = sites.find((itm) => itm.slug === params.slug)

  if (site) {
    for (const [key, val] of Object.entries(site)) {
      if (val instanceof Date) {
        site[key] = pretty_date(val)
      }
    }

    return { site }
  }
  throw error(404, `Page not found`)
}
