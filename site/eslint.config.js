import stylistic from '@stylistic/eslint-plugin'
import svelte from 'eslint-plugin-svelte'
import tslint from 'typescript-eslint'

/** @type { import("eslint").Linter.Config[] } */
export default [
  ...tslint.configs.recommended,
  ...svelte.configs[`flat/recommended`],
  { plugins: { '@stylistic': stylistic } },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        `error`,
        { argsIgnorePattern: `^_`, varsIgnorePattern: `^_` },
      ],
      '@stylistic/quotes': [`error`, `backtick`, { avoidEscape: true }],
      'svelte/no-at-html-tags': `off`,
    },
  },
  {
    languageOptions: { ecmaVersion: 2020 },
  },
  {
    files: [`**/*.svelte`],
    languageOptions: {
      parserOptions: {
        parser: tslint.parser,
      },
    },
  },
  {
    ignores: [`build/`, `.svelte-kit/`, `package/`],
  },
]
