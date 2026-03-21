import sites from '$site/src/sites.yml'
import { error } from '@sveltejs/kit'
import type { EntryGenerator, PageServerLoad } from './$types'

export const entries: EntryGenerator = () => sites.map((site) => ({ slug: site.slug }))

export const load: PageServerLoad = ({ params }) => {
  const { slug } = params

  // TODO revert back to sorted.sites such that PrevNext doesn't navigate to pages the user excluded
  const site = sites.find((site) => site.slug === slug)

  if (!site) throw error(404, `Page '${slug}' not found`)

  return { site, sites, slug }
}
