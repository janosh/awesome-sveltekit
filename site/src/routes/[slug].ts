import { RequestHandler } from '@sveltejs/kit'
import sites from '../sites.yml'

export const get: RequestHandler = ({ params }) => {
  const site = sites.find((itm) => itm.slug === params.slug)

  if (site) return { body: { site } }
  else return { status: 404 }
}
