import { fork } from 'child_process'
import { URL } from 'url'
import { dirname } from 'path'

export const rootDir = dirname(new URL(`..`, import.meta.url).pathname)

if (import.meta.url === `file://${process.argv[1]}`) {
  // module was not imported but called directly
  fork(`${rootDir}/site/scripts/parseSitesYaml.js`)
  fork(`${rootDir}/site/scripts/takeScreenshots.js`)
}
