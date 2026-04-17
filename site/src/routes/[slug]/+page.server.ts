import sites from '$site/src/sites.yml'
import { error } from '@sveltejs/kit'
import type { EntryGenerator, PageServerLoad } from './$types'

export const entries: EntryGenerator = () => sites.map((site) => ({ slug: site.slug }))

export const load: PageServerLoad = ({ params }) => {
  const { slug } = params

  // Currently uses all sites so PrevNext can navigate beyond filtered landing-page results.
  const site = sites.find((candidate_site) => candidate_site.slug === slug)

  // SvelteKit expects throwing its error() helper
  // oxlint-disable-next-line only-throw-error
  if (!site) throw error(404, `Page '${slug}' not found`)

  return { site, sites, slug }
}
