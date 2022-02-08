/// <reference types="@sveltejs/kit" />

declare module '*sites.yml' {
  const sites: import('./types').Site[]
  export default sites
}
