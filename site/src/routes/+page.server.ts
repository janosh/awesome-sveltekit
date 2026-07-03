import { env } from '$env/dynamic/private'
import type { RepoContributor } from '$lib'
import type { ServerLoad } from '@sveltejs/kit'

export const load: ServerLoad = async () => {
  try {
    const github_token = env.GH_TOKEN ?? env.GITHUB_TOKEN
    if (!github_token) return { repo_contributors: [] }

    const response = await fetch(
      `https://api.github.com/repos/janosh/awesome-sveltekit/contributors`,
      { cache: `force-cache`, headers: { Authorization: `token ${github_token}` } },
    )

    if (!response.ok) {
      console.error(`GitHub API returned ${response.status}: ${response.statusText}`)
      return { repo_contributors: [] }
    }

    const repo_contributors = ((await response.json()) as RepoContributor[]).filter(
      (contributor) => contributor.type !== `Bot`,
    )
    return { repo_contributors }
  } catch (error) {
    console.error(`Failed to fetch contributors:`, error)
    return { repo_contributors: [] }
  }
}
