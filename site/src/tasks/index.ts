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
  const raw_action = process.env.ACTION ?? `add-missing`
  if (!action_types.includes(raw_action as Action)) {
    throw new Error(
      `Invalid ACTION="${raw_action}", must be one of: ${action_types.join(`, `)}`,
    )
  }
  const action = raw_action as Action
  await fetch_github_metadata({ action })
  await update_readme()

  if (action === `make-screenshots` && process.env.NODE_ENV === `production`) {
    await make_screenshots()
  }
}
