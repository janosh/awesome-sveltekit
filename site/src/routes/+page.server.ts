import type { RepoContributor } from 'src/types'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const contributors = (await fetch(
    `https://api.github.com/repos/janosh/awesome-sveltekit/contributors`,
    { cache: `force-cache` }
  ).then((res) => res.json())) as RepoContributor[]

  return { repo_contributors: contributors.filter((itm) => itm.type !== `Bot`) }
}
