export * from './fetch-github-metadata'
export * from './screenshots'
export * from './update-readme'

export const action_types = [`add-missing`, `update-existing`] as const
export type Action = (typeof action_types)[number]
