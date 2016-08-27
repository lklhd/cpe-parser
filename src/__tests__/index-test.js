const fs = require('fs')
const peg = require('pegjs')

describe('index', () => {
  describe('parser', () => {
    beforeEach(function (done) {
      fs.readFile('src/index.pegjs', 'utf8', (err, data) => {
        if (err) {
          throw new Error(err)
        }
        this.parser = peg.generate(data)
        done()
      })
    })

    it('parses the empty string', function () {
      expect(this.parser.parse('')).toEqual('')
    })

    it('parses letters', function () {
      expect(this.parser.parse('abc')).toEqual('abc')
    })

    it('parses numbers', function () {
      expect(this.parser.parse('123')).toEqual('123')
    })

    it('parses numbers mixed with letters', function () {
      expect(this.parser.parse('123px')).toEqual('123px')
    })

    it('parses embedded code', function () {
      expect(this.parser.parse('{{products[1].name}}')).toEqual({
        type: 'ref',
        name: 'products',
        rank: 1,
        field: 'name'
      })
    })

    it('parses code embedded into a literal', function () {
      expect(this.parser.parse('Cool {{products[1].category}}!')).toEqual([
        'Cool ',
        {
          type: 'ref',
          name: 'products',
          rank: 1,
          field: 'category'
        },
        '!'
      ])
    })

    it('parses integer arithmetic using traditional operator precedence', function () {
      expect(this.parser.parse('{{1 + products[2].quantity / 2}}-ball')).toEqual([
        {
          type: '+',
          left: 1,
          right: {
            type: '/',
            left: {
              type: 'ref',
              name: 'products',
              rank: 2,
              field: 'quantity'
            },
            right: 2
          }
        },
        '-ball'
      ])
    })

    it('parses "A multiple embedded data references', function () {
      expect(this.parser.parse('A {{products[3].name}} is in {{products[3].category}}')).toEqual([
        'A ',
        {
          type: 'ref',
          name: 'products',
          rank: 3,
          field: 'name'
        },
        ' is in ',
        {
          type: 'ref',
          name: 'products',
          rank: 3,
          field: 'category'
        }
      ])
    })

    it('parses "parses unclosed curly braces as literal text', function () {
      expect(this.parser.parse('I need a bracket: {')).toEqual(
        'I need a bracket: {'
      )
    })

    xit('parses string literals in embedded code', function () {
      expect(this.parser.parse('I need a bracket: {{""}}')).toEqual(
        'I need a bracket: {'
      )
    })

    it('parses invalid code as literal text', function () {
      expect(this.parser.parse('A literal {{that is not valid code}}')).toEqual(
        'A literal {{that is not valid code}}'
      )
    })
  })
})
