export type Site = {
  title: string
  url: string
  slug: string
  description?: string
  repo?: string
  siteSrc?: string
  repoStars?: number
  creators: Creator[]
  tags: string[]
  uses?: string[]
  dateCreated?: string
  lastUpdated: string
}

export type Creator = {
  name: string
  url?: string
  twitter?: string
  github?: string
  email?: string
}
