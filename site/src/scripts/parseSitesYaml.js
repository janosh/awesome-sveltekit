/* eslint-disable no-console */
import yaml from 'js-yaml'

import fs from 'fs'

const sites = yaml.load(fs.readFileSync(`../sites.yml`))

fs.writeFileSync(
  `src/sites.ts`,
  `export default ${JSON.stringify(sites, null, 2)}`
)

console.log(`Finished parsing sites.yml`)
