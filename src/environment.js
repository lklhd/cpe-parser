/**
 * Resolves queries from a map to arrays of maps to field values.
 *
 * @param queries A map to arrays of maps to field values.
 * @param name Query name.
 * @param rank Query result rank.
 * @param field Query result field name.
 * @return Resolved value, or '' if there was an error.
 */
function queriesObjectReader (queries, name, rank, field) {
  if (!Object.prototype.hasOwnProperty.call(queries, name)) {
    return ''
  }
  const items = queries[name]
  if (rank - 1 >= items.length) {
    return ''
  }
  const item = queries[name][rank - 1]
  if (!Object.prototype.hasOwnProperty.call(item, field)) {
    return ''
  }
  return item[field]
}

/**
 * Resolves a query in an environment.
 *
 * @param env The environment to evaluate the query in.
 * @return A function that resolves a query given its name, rank, and field.
 */
function resolveQuery (env) {
  return (name, rank, field) => {
    if (!env || !env.queries) {
      return ''
    }
    const reader = typeof env.queries === 'function'
      ? env.queries
      : queriesObjectReader.bind(null, env.queries)

    const value = reader(name, rank, field)
    if (['number', 'string'].indexOf(typeof value) === -1) {
      return ''
    }
    return value
  }
}

module.exports = {
  query: resolveQuery
}
