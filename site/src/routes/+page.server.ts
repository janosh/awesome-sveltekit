import type { RepoContributor } from '$lib'
import type { ServerLoad } from '@sveltejs/kit'
import process from 'node:process'

export const load: ServerLoad = async () => {
  try {
    // Try to fetch contributors with GitHub token if available in environment
    const headers: Record<string, string> = {}
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `token ${process.env.GITHUB_TOKEN}`
    }

    const response = await fetch(
      `https://api.github.com/repos/janosh/awesome-sveltekit/contributors`,
      { cache: `force-cache`, headers },
    )

    const repo_contributors = (await response.json() as RepoContributor[])
      .filter((itm) => itm.type !== `Bot`)
    return { repo_contributors }
  } catch (error) {
    console.error(`Failed to fetch contributors:`, error)
    return { repo_contributors: [] }
  }
}
