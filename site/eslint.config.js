import svelte from 'eslint-plugin-svelte'
import tslint from 'typescript-eslint'

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  ...tslint.configs.recommended,
  ...svelte.configs[`flat/recommended`],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        `error`,
        { argsIgnorePattern: `^_`, varsIgnorePattern: `^_` },
      ],
      '@typescript-eslint/quotes': [`error`, `backtick`, { avoidEscape: true }],
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
    ignores: [`build/`],
  },
]
