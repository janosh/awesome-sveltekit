export const filter_modes = { all: `all`, any: `any` } as const
type FilterMode = keyof typeof filter_modes
// the shape MultiSelect binds into filters.tags/contributors
type SelectOption = { label: string; count: number }

export const filters = $state<{
  search: string
  tags: SelectOption[]
  contributors: SelectOption[]
  contributors_mode: FilterMode
  tags_mode: FilterMode
}>({ contributors: [], contributors_mode: `any`, search: ``, tags: [], tags_mode: `any` })

export const sort_by = { date: `Date Created`, stars: `GitHub Stars` } as const
type SortBy = keyof typeof sort_by
type SortOrder = `asc` | `desc`

export const sorted = $state<{ by: SortBy; order: SortOrder }>({
  by: `stars`,
  order: `desc`,
})

// URL params mirroring filter/sort state. Multi-selects join their labels with
// commas (?tags=a,b). No tag or contributor name contains a comma.
const join = (items: SelectOption[]) => items.map(({ label }) => label).join(`,`)

type LabelCounts = [label: string, count: number][]
type FilterOptions = { tags: LabelCounts; contributors: LabelCounts }

export function filters_to_query(url: URL): string {
  const params = new URLSearchParams(url.searchParams)
  // Every param we own, as key => [current value, default]. Anything sitting at
  // its default is dropped to keep shared links short.
  const managed: Record<string, [value: string, default_value: string]> = {
    q: [filters.search, ``],
    tags: [join(filters.tags), ``],
    contributors: [join(filters.contributors), ``],
    tags_mode: [filters.tags_mode, `any`],
    contributors_mode: [filters.contributors_mode, `any`],
    sort: [sorted.by, `stars`],
    order: [sorted.order, `desc`],
  }
  for (const [key, [value, default_value]] of Object.entries(managed)) {
    if (value === default_value) params.delete(key)
    else params.set(key, value)
  }

  // commas are legal in a query string, so leave them readable
  return params.toString().replaceAll(`%2C`, `,`)
}

// Unrecognized values fall back to the default instead of throwing so a
// hand-edited or stale URL still renders the page.
const parse_key = <T extends string>(
  value: string | null,
  options: Record<T, unknown>,
  fallback: T,
): T => (Object.hasOwn(options, value ?? ``) ? (value as T) : fallback)

// Iterating options rather than values drops unknown labels and duplicates, so
// the URL can only express states the UI can also produce (and round-trip).
const parse_labels = (value: string | null, options: LabelCounts) => {
  const labels = value?.split(`,`) ?? []
  return options
    .filter(([label]) => labels.includes(label))
    .map(([label, count]) => ({ label, count }))
}

export function filters_from_query(query: string, options: FilterOptions) {
  const params = new URLSearchParams(query)
  filters.search = params.get(`q`) ?? ``
  filters.tags = parse_labels(params.get(`tags`), options.tags)
  filters.contributors = parse_labels(params.get(`contributors`), options.contributors)
  const mode = (key: string) => parse_key(params.get(key), filter_modes, `any`)
  filters.tags_mode = mode(`tags_mode`)
  filters.contributors_mode = mode(`contributors_mode`)
  sorted.by = parse_key(params.get(`sort`), sort_by, `stars`)
  // only `asc` is non-default; anything else (incl. missing/bogus) → desc
  sorted.order = params.get(`order`) === `asc` ? `asc` : `desc`
}
