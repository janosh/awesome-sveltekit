/// <reference types="@sveltejs/kit" />

declare module '*sites.yml' {
  const sites: import('./lib').Site[]
  export default sites
}

declare module '*tools.yml' {
  const links: Record<string, string>
  export default links
}
