import { error } from '@sveltejs/kit'
import sites from '../../sites.yml'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params }) => {
  const site = sites.find((itm) => itm.slug === params.slug)

  if (site) return { site }
  throw error(404, `Page not found`)
}
