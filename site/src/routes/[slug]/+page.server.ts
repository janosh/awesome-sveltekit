import sites from '$site/src/sites.yml'
import { error } from '@sveltejs/kit'

export const entries = () => {
  // Return an array of all possible slug values
  return sites.map((site) => ({ slug: site.slug }))
}

export const load = ({ params }) => {
  const { slug } = params

  // TODO revert back to filtered_sites such that PrevNext doesn't navigate to pages the user excluded
  const site = sites.find((site) => site.slug === slug)

  if (!site) throw error(404, `Page '${slug}' not found`)

  return { site, sites, slug }
}
