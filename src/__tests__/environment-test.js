const environment = require('../environment')

describe('environment', () => {
  describe('query', () => {
    it('returns an empty string when there is no environment provided', () => {
      expect(environment.query()('name', 1, 'field')).toBe('')
    })

    describe('with an environment.queries object', () => {
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
        expect(environment.query({ queries: { name: [{ field: {} }] } })('name', 1, 'field'))
          .toBe('')
      })

      it('returns the value read from the queries object', () => {
        expect(environment.query({ queries: { name: [{ field: 'abc' }] } })('name', 1, 'field'))
          .toBe('abc')
        expect(environment.query({ queries: { name: [{ field: 123 }] } })('name', 1, 'field'))
          .toBe(123)
      })
    })

    describe('with an environment.queries function', () => {
      beforeEach(function () {
        this.env = {
          queries: jest.fn()
        }
      })

      it('uses the passes the name, rank, and field to the function', function () {
        environment.query(this.env)('name', 1, 'field')
        expect(this.env.queries.mock.calls.length).toBe(1)
        expect(this.env.queries).toBeCalledWith('name', 1, 'field')
      })

      it('returns an empty string when the value is undefined', function () {
        this.env.queries.mockReturnValueOnce(undefined)
        expect(environment.query(this.env)('name', 1, 'field')).toBe('')
      })

      it('returns an empty string when the value is not a string or number', function () {
        this.env.queries.mockReturnValueOnce({})
        expect(environment.query(this.env)('name', 1, 'field')).toBe('')
      })

      it('returns the value from the queries function', function () {
        this.env.queries.mockReturnValueOnce('abc')
        expect(environment.query(this.env)('name', 1, 'field')).toBe('abc')
      })
    })
  })
})
