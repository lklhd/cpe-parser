describe('evaluate', () => {
  describe('fromString', () => {
    beforeEach(function () {
      this.parse = jest.fn()
      this.evaluate = require('../evaluate')(this.parse)
    })

    it('parses the input into an AST before evaluating', function () {
      this.parse.mockReturnValueOnce(['abc', { type: 'ref', name: 'q', rank: 1, field: 'a' }])

      const env = {
        queries: {
          q: [ { a: '123' } ]
        }
      }
      expect(this.evaluate.fromString('abc{{q[1].a}}', env)).toBe('abc123')
      expect(this.parse).toBeCalledWith('abc{{q[1].a}}')
    })
  })

  describe('fromAST', () => {
    beforeEach(function () {
      this.resolve = jest.fn()
      this.query = jest.fn(() => {
        return this.resolve
      })
      jest.mock('../environment', () => ({
        query: this.query
      }))
      this.eval = require('../evaluate')().fromAST
    })

    it('throws an error with an undefined AST', function () {
      expect(() => this.eval(undefined)).toThrowError(/unrecognized AST/)
    })

    it('evaluates plain strings', function () {
      expect(this.eval('')).toBe('')
      expect(this.eval('abc')).toBe('abc')
      expect(this.eval('with spaces')).toBe('with spaces')
      expect(this.eval('with numbers 123')).toBe('with numbers 123')
      expect(this.eval('with {{ symbols!@#$%^')).toBe('with {{ symbols!@#$%^')
    })

    it('evaluates plain numbers', function () {
      expect(this.eval(123)).toBe(123)
      expect(this.eval(-123)).toBe(-123)
      expect(this.eval(0)).toBe(0)
      expect(this.eval(0.0)).toBe(0.0)
      expect(this.eval(1.23)).toBe(1.23)
      expect(this.eval(-1.23)).toBe(-1.23)
    })

    it('evaluates plain lists', function () {
      expect(this.eval([])).toBe('')
      expect(this.eval(['a'])).toBe('a')
      expect(this.eval(['a', 'b', 'c'])).toBe('abc')
      expect(this.eval([1, 2, 3])).toBe('123')
      expect(this.eval(['a', 1])).toBe('a1')
      expect(this.eval([1, 'a'])).toBe('1a')
    })

    it('evaluates nested lists', function () {
      expect(this.eval(['a', ['b', 'c']])).toBe('abc')
      expect(this.eval([['a', 'b'], 'c'])).toBe('abc')
      expect(this.eval(['a', ['b', 3]])).toBe('ab3')
    })

    describe('in an environment', function () {
      beforeEach(function () {
        this.env = {}
        this.evalEnv = (ast) => this.eval(ast, this.env)
      })

      it('throws an error with an invalid ref AST', function () {
        expect(() => this.evalEnv({ type: 'ref' })).toThrowError(/invalid AST/)
        expect(() => this.evalEnv({ type: 'ref', name: 123, rank: 1, field: 'id' }))
          .toThrowError(/invalid AST/)
        expect(() => this.evalEnv({ type: 'ref', name: 'q1', rank: '1', field: 'id' }))
          .toThrowError(/invalid AST/)
        expect(() => this.evalEnv({ type: 'ref', name: 'q1', rank: 1, field: 123 }))
          .toThrowError(/invalid AST/)
        expect(() => this.evalEnv({ type: 'ref', name: 'q1', rank: 0, field: 'id' }))
          .toThrowError(/invalid AST/)
        expect(() => this.evalEnv({ type: 'ref', name: 'q1', rank: -1, field: 'id' }))
          .toThrowError(/invalid AST/)
      })

      it('passes the environment to the environment query reader', function () {
        this.evalEnv({ type: 'ref', name: 'q1', rank: 1, field: 'id' })
        expect(this.query).toBeCalledWith(this.env)
        expect(this.query.mock.calls.length).toBe(1)
      })

      it('delegates the resolution of a query to the environment', function () {
        this.resolve.mockReturnValueOnce('123')
        expect(this.evalEnv({ type: 'ref', name: 'q1', rank: 1, field: 'id' })).toBe('123')
        expect(this.resolve).toBeCalledWith('q1', 1, 'id')
        expect(this.resolve.mock.calls.length).toBe(1)
      })

      it('evaluates nested refs', function () {
        this.resolve.mockReturnValueOnce('123')
        expect(this.evalEnv(['abc', { type: 'ref', name: 'q1', rank: 1, field: 'id' }]))
          .toBe('abc123')
      })

      it('evaluates arithmetic expressions', function () {
        expect(this.evalEnv({ type: '+', left: 1, right: 2 })).toBe(3)
        expect(this.evalEnv({ type: '+', left: 1.1, right: 2.2 })).toBeCloseTo(3.3, 5)
        expect(this.evalEnv({ type: '+', left: { type: '*', left: 1, right: 2 }, right: 3 }))
          .toBe(5)
        expect(this.evalEnv({ type: '-', left: { type: '*', left: 1, right: 2 }, right: 3 }))
          .toBe(-1)
        expect(this.evalEnv({ type: '/', left: { type: '*', left: 1, right: 2 }, right: 3 }))
          .toBeCloseTo(2 / 3, 5)
        expect(this.evalEnv([{ type: '+', left: 2, right: 3 }, 'a'])).toBe('5a')
      })

      it('evaluates arithmetic expressions with query results as operands', function () {
        this.resolve.mockReturnValue(123.4)
        expect(
          this.evalEnv({
            type: '+',
            left: { type: 'ref', name: 'q1', rank: 1, field: 'id' },
            right: { type: 'ref', name: 'q1', rank: 1, field: 'price' }
          })
        ).toBeCloseTo(246.8, 5)
        expect(this.resolve.mock.calls.length).toBe(2)
        expect(this.resolve.mock.calls[0]).toEqual(['q1', 1, 'id'])
        expect(this.resolve.mock.calls[1]).toEqual(['q1', 1, 'price'])
      })
    })
  })
})
