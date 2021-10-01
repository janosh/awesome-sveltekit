export type Site = {
  title: string
  url: string
  description?: string
  repo: string | null
  repoStars?: number
  creator: string
  creatorUrl?: string
  creatorTwitter?: string
  tags: string[]
  dateCreated?: string
  lastUpdated: string
}
