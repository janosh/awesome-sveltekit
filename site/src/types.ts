export type Site = {
  title: string
  url: string
  description?: string
  repo?: string
  repoStars?: number
  creator: string | string[]
  creatorUrl?: string | string[]
  creatorTwitter?: string | string[]
  tags: string[]
  dateCreated?: string
  lastUpdated: string
}
