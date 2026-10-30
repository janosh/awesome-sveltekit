import fs from 'node:fs'
import { load } from 'js-yaml'
import { afterEach, expect, it, vi } from 'vite-plus/test'
import { load_sites, repo_handle } from '../../src/tasks/enrich-sites.ts'
import { fetch_github_metadata } from '../../src/tasks/fetch-github-metadata.ts'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

it(`isolates a failing site, keeps its old entry, writes the rest and still fails`, async () => {
  const repo_sites = load_sites().filter(({ repo }) => repo)
  const [broken, other] = repo_sites
  const broken_handle = repo_handle(broken.repo ?? ``)
  vi.stubEnv(`GH_TOKEN`, `test-token`)
  vi.stubGlobal(
    `fetch`,
    vi.fn(async (url: string) => {
      const json = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), { status })
      if (url.endsWith(`${broken_handle}/contributors`)) return json({}, 404)
      if (url.endsWith(`/contributors`)) {
        return json([
          { contributions: 50, type: `User`, url: `https://api.github.com/users/x` },
        ])
      }
      if (url.endsWith(`/users/x`))
        return json({ login: `x`, avatar_url: `a`, name: null })
      return json({ stargazers_count: 42 })
    }),
  )
  const write = vi.spyOn(fs, `writeFileSync`).mockImplementation(() => undefined)
  vi.spyOn(console, `warn`).mockImplementation(() => undefined)
  vi.spyOn(console, `error`).mockImplementation(() => undefined)
  const old_broken = load_sites().find(({ slug }) => slug === broken.slug)

  await expect(fetch_github_metadata({ action: `update-existing` })).rejects.toThrow(
    `GitHub fetch failed for: ${broken.title}`,
  )
  const written = load(write.mock.calls[0][1] as string) as Record<string, unknown>
  expect(written[other.slug]).toEqual({
    repo_stars: 42,
    contributors: [{ avatar: `a`, github: `x`, name: `x` }],
  })
  expect(written[broken.slug]).toEqual({
    repo_stars: old_broken?.repo_stars,
    contributors: old_broken?.contributors,
  })
  for (const { slug } of repo_sites) expect(written).toHaveProperty([slug])
})
