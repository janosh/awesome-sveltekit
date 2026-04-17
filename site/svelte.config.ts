import adapter from '@sveltejs/adapter-static'
import type { Config } from '@sveltejs/kit'

export default {
  kit: {
    adapter: adapter(),

    alias: { $root: `..`, $site: `.` },
  },
} satisfies Config
