import { RequestHandler } from '@sveltejs/kit'
import sites from '../sites'

export const get: RequestHandler = ({ params }) => {
  const { slug } = params

  const site = sites.find((itm) => itm.slug === slug)

  if (site) return { body: site }

  // Not returning is equivalent to a 404 response.
  // https://kit.svelte.dev/docs#routing-endpoints
}
