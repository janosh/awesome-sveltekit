import type { RepoContributor } from '$lib/types'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ fetch }) => {
  const contributors: RepoContributor[] = await fetch(
    `https://api.github.com/repos/janosh/awesome-sveltekit/contributors`,
    { cache: `force-cache` }
  ).then((res) => res.json())

  const repo_contributors = contributors?.filter((itm) => itm.type !== `Bot`)
  return { repo_contributors }
}
