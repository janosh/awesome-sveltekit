import { sorted_sites } from '$lib/stores'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

export const load = ({ params }) => {
  const { slug } = params

  const sites = get(sorted_sites)

  const site = sites.find((site) => site.slug === slug)

  if (!site) throw error(404, `Page '${slug}' not found`)

  return { site, sites, slug }
}
