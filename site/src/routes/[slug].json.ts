import { RequestHandler } from '@sveltejs/kit'
import sites from '../sites'

export const get: RequestHandler = ({ params }) => {
  const site = sites.find((itm) => itm.slug === params.slug)

  if (site) return { body: site }
  else return { fallthrough: true }
}
