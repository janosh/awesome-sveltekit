import { dirname } from 'path'
import { URL } from 'url'

export const rootDir = dirname(new URL(`..`, import.meta.url).pathname)

export function titleToSlug(title) {
  return title.toLowerCase().replaceAll(` `, `-`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  // module was not imported but called directly
  const { fork } = await import(`child_process`)
  fork(`${rootDir}/site/scripts/parseSitesYaml.js`)
  fork(`${rootDir}/site/scripts/screenshots.js`)
}
