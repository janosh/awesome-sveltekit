export { default as ContributorList } from './ContributorList.svelte'
export { default as Filters } from './Filters.svelte'
export { default as Person } from './Person.svelte'
export { default as Screenshot } from './Screenshot.svelte'
export { default as SiteDetails } from './SiteDetails.svelte'
export { default as SiteList } from './SiteList.svelte'
export { default as SitePreview } from './SitePreview.svelte'

export type Site = {
  title: string
  url: string
  slug: string
  description?: string
  repo?: string
  npm?: string
  site_src?: string
  repo_stars?: number
  contributors: Contributor[]
  tags: string[]
  uses: string[]
  date_created: Date
  last_updated: string
}

export type Contributor = {
  name: string
  url?: string
  twitter?: string
  github?: string
  email?: string
  avatar?: string
  location?: string
  company?: string
}

// partial schema returned by
// fetch('https://api.github.com/repos/janosh/awesome-sveltekit/contributors')
export type RepoContributor = {
  login: string
  id: number
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  repos_url: string
  type: 'User' | 'Bot'
  contributions: number
}
