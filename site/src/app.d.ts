/// <reference types="@sveltejs/kit" />

declare module '*sites.yml' {
  const sites: import('./types').Site[]
  export default sites
}

declare module '*uses-links.yml' {
  const links: Record<string, string>
  export default links
}
