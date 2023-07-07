/* eslint-disable no-console */
/* This file parses sites.yml, then updates the list of sites in the readme. */

import fs from 'fs'
import yaml from 'js-yaml'

export function update_readme() {
  const readme_path = `../readme.md`
  const sites_yaml_path = `../sites.yml`

  const readme = fs.readFileSync(readme_path, `utf8`)
  const sites = yaml.load(fs.readFileSync(sites_yaml_path))

  const new_line = `\n   `

  const new_sites = sites
    .map((site) => {
      const { title, repo, uses, description, url, site_src } = site

      if ([title, uses, description, url].includes(undefined)) {
        throw new Error(`missing field(s) in site '${title}'`)
      }

      try {
        let code_link = ``
        if (repo) {
          const repo_handle = repo.split(`github.com/`)[1]
          if (repo_handle.split(`/`).length !== 2) {
            throw `bad repo handle ${repo_handle}`
          }
          const star_badge = `<img src="https://img.shields.io/github/stars/${repo_handle}?logo=github" alt="GitHub stars" valign="middle">`
          code_link =
            `&ensp;${new_line}[[code](${site_src ?? repo})]&ensp;${new_line}` +
            `<a href="${repo}/stargazers">${new_line}${star_badge}${new_line}</a>`
        }

        let metadata = description
        if (uses?.length > 0) {
          metadata += `<br>\n${new_line}uses: [${uses.join(`], [`)}]`
        }

        return `1. **[${title}](${url})**${code_link}\n${new_line}${metadata}\n`
      } catch (err) {
        throw `${err} for site '${title}'`
      }
    })
    .join(`\n`)

  const uses_links = Object.entries(yaml.load(fs.readFileSync(`../tools.yml`)))
    .map(([name, url]) => `[${name}]: ${url}`)
    .join(`\n`)

  // replace old sites
  const new_readme = readme.replace(
    /## Sites\n\n[\s\S]+\n\n## /, // match everything up to next heading
    `## Sites\n\n${new_sites}\n${uses_links}\n\n## `,
  )

  fs.writeFileSync(readme_path, new_readme)

  const this_file = import.meta.url.split(`/`).pop()
  console.log(`${this_file} updated readme\n`)
}
