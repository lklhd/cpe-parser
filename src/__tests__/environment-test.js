const environment = require('../environment')

describe('environment', () => {
  describe('query', () => {
    it('returns an empty string when there is no environment provided', () => {
      expect(environment.query()('name', 1, 'field')).toBe('')
    })

    it('returns an empty string when the environment has no queries', () => {
      expect(environment.query({})('name', 1, 'field')).toBe('')
    })

    it('returns an empty string when the name is not found in the queries', () => {
      expect(environment.query({ queries: {} })('name', 1, 'field')).toBe('')
    })

    it('returns an empty string when the rank is out of bounds', () => {
      expect(environment.query({ queries: { name: [] } })('name', 1, 'field')).toBe('')
      expect(environment.query({ queries: { name: [{}] } })('name', 2, 'field')).toBe('')
    })

    it('returns an empty string when the field is not in the item', () => {
      expect(environment.query({ queries: { name: [{}] } })('name', 1, 'field')).toBe('')
    })

    it('returns an empty string when the value is not a string or number', () => {
      expect(environment.query({ queries: { name: [{ field: {} }] } })('name', 1, 'field')).toBe('')
    })

    it('returns the value from the queries field of the environment', () => {
      expect(environment.query({ queries: { name: [{ field: 'abc' }] } })('name', 1, 'field'))
        .toBe('abc')
      expect(environment.query({ queries: { name: [{ field: 123 }] } })('name', 1, 'field'))
        .toBe(123)
    })
  })
})
