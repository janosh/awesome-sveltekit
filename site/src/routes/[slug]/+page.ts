import sites from '../../../../sites.yml'
import { error } from '@sveltejs/kit'
import type { EntryGenerator, PageLoad } from './$types'

export const entries: EntryGenerator = () => sites.map(({ slug }) => ({ slug }))

// Universal, not server: the client already bundles sites.yml through the layout, so
// a server load would only re-ship every site in each page's __data.json. Returns all
// sites so PrevNext can navigate beyond the landing page's filtered results.
export const load: PageLoad = ({ params: { slug } }) => {
  const site = sites.find((candidate) => candidate.slug === slug)
  if (!site) error(404, `Page '${slug}' not found`)
  return { site, sites, slug }
}
