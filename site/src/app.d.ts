/// <reference types="@sveltejs/kit" />

interface ImportMeta {
  main?: boolean
}

declare module '*sites.yml' {
  export const lastParsed: string
  // inline import() type, not a top-level `import ... from './lib'` statement: the statement
  // form poisons this wildcard module's element type to `any` (sites[0]/.filter/.find lose `Site`)
  // oxlint-disable-next-line typescript/consistent-type-imports
  const sites: import('./lib').Site[]
  export default sites
}

declare module '*tools.yml' {
  const links: Record<string, string>
  export default links
}
