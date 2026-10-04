import { readFileSync } from 'node:fs'
import { expect, it } from 'vite-plus/test'

const workflow = readFileSync(
  new URL(`../../../.github/workflows/ci.yml`, import.meta.url),
  `utf8`,
)
const accepted_statuses = /^\s+--accept (?<status_codes>[^\n]+)$/mu
  .exec(workflow)
  ?.groups?.status_codes?.split(`,`)

it.each([
  [`530`, true],
  [`404`, false],
  [`410`, false],
] as const)(`link-check accepts HTTP %s: %s`, (status_code, accepted) => {
  expect(accepted_statuses?.includes(status_code)).toBe(accepted)
})
