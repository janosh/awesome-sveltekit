export { default as ContributorList } from './ContributorList.svelte'
export { default as Filters } from './Filters.svelte'
export { default as Person } from './Person.svelte'
export { default as Screenshot } from './Screenshot.svelte'
export { default as SiteDetails } from './SiteDetails.svelte'
export { default as SiteList } from './SiteList.svelte'
export { default as SitePreview } from './SitePreview.svelte'

export type RawSite = {
  title: string
  url: string
  description?: string
  repo?: string
  npm?: string
  site_src?: string
  tags: string[]
  uses: string[]
  date_added: Date
  date_created: Date
}

export type Site = RawSite & {
  slug: string
  repo_stars?: number
  contributors: Contributor[]
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
