import { env } from '$env/dynamic/private'
import type { ServerLoad } from '@sveltejs/kit'
import type { Contributor } from 'svelte-widgets'

// GitHub's contributor payload; ContributorList only needs the structural fields
type GhContributor = Contributor & { type: `User` | `Bot` }

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

    const repo_contributors = ((await response.json()) as GhContributor[]).filter(
      (contributor) => contributor.type !== `Bot`,
    )
    return { repo_contributors }
  } catch (error) {
    console.error(`Failed to fetch contributors:`, error)
    return { repo_contributors: [] }
  }
}
