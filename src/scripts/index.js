import { fork } from 'child_process'

fork(`src/scripts/parseSitesYaml.js`)
fork(`src/scripts/takeSiteScreenshots.js`)
