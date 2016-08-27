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

    it('parses "abc"', function () {
      expect(this.parser.parse('abc')).toEqual('abc')
    })

    it('parses "123"', function () {
      expect(this.parser.parse('123')).toEqual('123')
    })

    it('parses "123px"', function () {
      expect(this.parser.parse('123px')).toEqual('123px')
    })

    it('parses "{{products[1].name}}"', function () {
      expect(this.parser.parse('{{products[1].name}}')).toEqual({
        type: 'ref',
        name: 'products',
        rank: 1,
        field: 'name'
      })
    })

    it('parses "Cool {{products[1].category}}!"', function () {
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

    it('parses "A {{products[3].name}} is in {{products[3].category}}"', function () {
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

    it('parses "A literal {{that is not valid code}}"', function () {
      expect(this.parser.parse('A literal {{that is not valid code}}')).toEqual(
        'A literal {{that is not valid code}}'
      )
    })
  })
})
