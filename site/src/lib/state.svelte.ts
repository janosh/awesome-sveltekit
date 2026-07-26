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
export const sort_orders = { asc: `asc`, desc: `desc` } as const
type SortOrder = keyof typeof sort_orders

export const sorted = $state<{ by: SortBy; order: SortOrder }>({
  by: `stars`,
  order: `desc`,
})

// URL params mirroring filter/sort state. Multi-selects join their labels with
// commas (?tags=a,b). No tag or contributor name contains a comma.
const url_keys = `q tags tags_mode contributors contributors_mode sort order`.split(` `)
const join = (items: SelectOption[]) => items.map(({ label }) => label).join(`,`)

type LabelCounts = [label: string, count: number][]
type FilterOptions = { tags: LabelCounts; contributors: LabelCounts }

// Params at their default value are omitted to keep shared links short.
export function filters_to_query(url: URL): string {
  const params = new URLSearchParams(url.searchParams)
  for (const key of url_keys) params.delete(key)

  const { search, tags, contributors, tags_mode, contributors_mode } = filters
  if (search) params.set(`q`, search)
  if (tags.length) params.set(`tags`, join(tags))
  if (contributors.length) params.set(`contributors`, join(contributors))
  if (tags_mode !== `any`) params.set(`tags_mode`, tags_mode)
  if (contributors_mode !== `any`) params.set(`contributors_mode`, contributors_mode)
  if (sorted.by !== `stars`) params.set(`sort`, sorted.by)
  if (sorted.order !== `desc`) params.set(`order`, sorted.order)

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
  sorted.order = parse_key(params.get(`order`), sort_orders, `desc`)
}
