import { fork } from 'child_process'
import { pathToFileURL, URL } from 'url'

export const root_dir = new URL(`../..`, import.meta.url).pathname
const this_dir = new URL(`.`, import.meta.url).pathname

export function title_to_slug(title: string): string {
  return title.toLowerCase().replaceAll(` `, `-`)
}

// https://stackoverflow.com/a/68848622
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  // module was not imported but called directly
  // process.argv.slice(2) forwards CLI args to child process
  const argv = process.argv.slice(2)
  fork(`${this_dir}/fetch-github-metadata.js`, argv)
  fork(`${this_dir}/screenshots.js`, argv)
  fork(`${this_dir}/update-readme.js`, argv)
}
