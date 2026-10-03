import { defineEnvVars } from '@sveltejs/kit/env'

// Optional GitHub tokens for fetching repo contributors. Returning the raw value
// keeps unset vars undefined so GH_TOKEN ?? GITHUB_TOKEN falls through.
const optional = (value: string | undefined) => value

export const variables = defineEnvVars({
  GH_TOKEN: { schema: optional },
  GITHUB_TOKEN: { schema: optional },
})
