import process from 'node:process'
import { fetch_github_metadata } from './fetch-github-metadata'
import { make_screenshots } from './screenshots'
import { update_readme } from './update-readme'

export const action_types = [
  `add-missing`,
  `update-existing`,
  `make-screenshots`,
] as const
export type Action = (typeof action_types)[number]

if (import.meta.main) {
  const action = (process.env.ACTION ?? `add-missing`) as Action
  await fetch_github_metadata({ action })
  await update_readme()

  if (action === `make-screenshots` && process.env.NODE_ENV === `production`) {
    await make_screenshots()
  }
}
