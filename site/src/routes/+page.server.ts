import type { RepoContributor } from '$lib'
import type { ServerLoad } from '@sveltejs/kit'
import process from 'node:process'

export const load: ServerLoad = async () => {
  try {
    // Try to fetch contributors with GitHub token if available in environment
    const headers: Record<string, string> = {}
    const github_token = process.env.GITHUB_TOKEN
    if (github_token !== undefined && github_token !== ``) {
      headers.Authorization = `token ${github_token}`
    }

    const response = await fetch(
      `https://api.github.com/repos/janosh/awesome-sveltekit/contributors`,
      { cache: `force-cache`, headers },
    )

    if (!response.ok) {
      console.error(`GitHub API returned ${response.status}: ${response.statusText}`)
      return { repo_contributors: [] }
    }

    const repo_contributors = ((await response.json()) as RepoContributor[]).filter(
      (itm) => itm.type !== `Bot`,
    )
    return { repo_contributors }
  } catch (error) {
    console.error(`Failed to fetch contributors:`, error)
    return { repo_contributors: [] }
  }
}
