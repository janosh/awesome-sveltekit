/// <reference types="@sveltejs/kit" />

export type Site = {
  title: string
  url: string
  description?: string
  repo: string | null
  creator: string
  creatorUrl?: string
  creatorTwitter?: string
  tags: string[]
  dateCreated?: string
  lastUpdated: string
}
