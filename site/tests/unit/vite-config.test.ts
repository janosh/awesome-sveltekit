import { spawn } from 'node:child_process'
import type { ViteDevServer } from 'vite'
import { expect, it, vi } from 'vite-plus/test'
import { run_site_tasks } from '../../vite.config.ts'

vi.mock(`node:child_process`, () => ({ spawn: vi.fn(() => ({ on: vi.fn() })) }))

it.each([
  [`1`, {}, 0],
  [``, {}, 1],
  [``, { AUTO_SITE_TASKS: `0` }, 0],
])(`site tasks with VITEST=%j, env=%j spawn %i times`, (vitest, env, expected) => {
  vi.stubEnv(`VITEST`, vitest)
  const server = { config: { logger: { info: vi.fn(), warn: vi.fn() } } }
  const { configureServer } = run_site_tasks(env)
  if (typeof configureServer !== `function`) throw new Error(`expected a hook function`)
  void configureServer.call({} as never, server as unknown as ViteDevServer)
  expect(spawn).toHaveBeenCalledTimes(expected)
  vi.mocked(spawn).mockClear()
  vi.unstubAllEnvs()
})
