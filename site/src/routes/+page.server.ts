import { GH_TOKEN, GITHUB_TOKEN } from '$app/env/private'
import type { ServerLoad } from '@sveltejs/kit'
import type { Contributor } from 'svelte-widgets'

// GitHub's contributor payload; ContributorList only needs the Contributor fields
type GhContributor = Contributor & { type: `User` | `Bot` }

// The endpoint is public; a token (when set) only raises the rate limit. An empty
// list hides the contributors section rather than failing the build.
export const load: ServerLoad = async () => {
  const token = GH_TOKEN ?? GITHUB_TOKEN
  try {
    // GitHub pages 30 per request by default
    const response = await fetch(
      `https://api.github.com/repos/janosh/awesome-sveltekit/contributors?per_page=100`,
      { headers: token ? { authorization: `token ${token}` } : {} },
    )
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`)
    const contributors = (await response.json()) as GhContributor[]
    // keep only what ContributorList renders: the full payload is inlined in index.html
    const repo_contributors: Contributor[] = contributors
      .filter(({ type }) => type !== `Bot`)
      .map(({ login, avatar_url, html_url }) => ({ login, avatar_url, html_url }))
    return { repo_contributors }
  } catch (error) {
    console.error(`Failed to fetch contributors:`, error)
    return { repo_contributors: [] }
  }
}
