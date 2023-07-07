import type { RepoContributor } from '$lib'

export const load = async ({ fetch }) => {
  const contributors: RepoContributor[] = await fetch(
    `https://api.github.com/repos/janosh/awesome-sveltekit/contributors`,
    { cache: `force-cache` },
  ).then((res) => res.json())

  const repo_contributors = contributors?.filter((itm) => itm.type !== `Bot`)
  return { repo_contributors }
}
