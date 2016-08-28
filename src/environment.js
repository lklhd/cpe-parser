function resolveQuery (env) {
  return (name, rank, field) => {
    if (!env || !env.queries || !Object.prototype.hasOwnProperty.call(env.queries, name)) {
      return ''
    }
    const items = env.queries[name]
    if (rank - 1 >= items.length) {
      return ''
    }
    const item = env.queries[name][rank - 1]
    if (!Object.prototype.hasOwnProperty.call(item, field)) {
      return ''
    }
    const value = item[field]
    if (['number', 'string'].indexOf(typeof value) === -1) {
      return ''
    }
    return value
  }
}

module.exports = {
  query: resolveQuery
}
