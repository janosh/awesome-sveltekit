export type Site = {
  title: string
  url: string
  slug: string
  description?: string
  repo?: string
  siteSrc?: string
  repoStars?: number
  contributors: Contributor[]
  tags: string[]
  uses: string[]
  dateCreated?: string
  lastUpdated: string
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
