export type Site = {
  title: string
  url: string
  slug: string
  description?: string
  repo?: string
  site_src?: string
  repo_stars?: number
  contributors: Contributor[]
  tags: string[]
  uses: string[]
  date_created: string
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
